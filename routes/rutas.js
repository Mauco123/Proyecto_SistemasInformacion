// routes/rutas.js
const express = require('express');
const router = express.Router(); // <-- CAMBIO 1: Usar Router en lugar de app
const db = require('../DB/db'); 
const crypto = require('crypto');

// Funcion usada para generar el codigo hash
function generarHash(numero_oficio,nombre, seccion, asunto, fecha) {
    const data =[
        numero_oficio,
        nombre,
        seccion,
        asunto,
        fecha
    ].join('|'); 
    return crypto.createHash('sha256').update(data).digest('hex');
}

// CAMBIO 2: Usar 'router.get' en lugar de 'app.get' (y así con post, etc.)
router.get('/', (req, res) => {
    const consulta = 'SELECT * FROM oficio';

    db.query(consulta, (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            res.send('Error, por favor contacta a soporte técnico.');
        } else {
            // Tu middleware 'checkAuth' ya protegió esta ruta.
            // Podemos pasar el nombre de usuario a la vista si queremos.
            res.render('index', { 
                oficios: results,
                username: req.session.username // Opcional, pero útil
            });
        }
    });
});

//Agregar un nuevo oficio
router.post('/add', (req, res) => {
    //... (Tu lógica de /add aquí)
    // NOTA: Tu hash no incluye 'numero_oficio', pero la función sí lo recibe.
    // Lo ajusto a los datos que realmente estás pasando:
    const {nombre, seccion, asunto, fecha} = req.body;
    const hash = generarHash(null, nombre, seccion, asunto, fecha); // 'numero_oficio' es null aquí

    const insertarRegistro = 'INSERT INTO oficio (nombre, seccion, asunto, fecha, hash) VALUES (?, ?, ?, ?, ?)';
    db.query(insertarRegistro, [nombre, seccion, asunto, fecha, hash], (err, result) => {
        if (err) {
            console.error('No se pudo insertar el registro:', err);
            res.send("Error al insertar"); // Siempre da feedback al cliente
        } else {
            res.redirect('/');
        }
    });
});

//Formulario de edicion de un oficio
router.get('/edit/:numero_oficio', (req, res) => {
    //... (Tu lógica de /edit aquí)
    const { numero_oficio } = req.params;
    const buscarOficio = 'SELECT * FROM oficio WHERE numero_oficio = ?';
    db.query(buscarOficio, [numero_oficio], (err, results) => {
        if (err) { /* ... manejo de error ... */ }
        if (results.length === 0) { /* ... manejo de error ... */ }
        res.render('edit', { oficio: results[0] });
    });
});


//Consulta para actualizar un oficio
router.post('/update/:numero_oficio', (req, res) => {
    //... (Tu lógica de /update aquí)
    const { numero_oficio } = req.params;
    const { nombre, seccion, asunto, fecha } = req.body;
    // Aquí sí tenemos 'numero_oficio' para el hash
    const hash = generarHash(numero_oficio, nombre, seccion, asunto, fecha);
    const actualizarOficio = 'UPDATE oficio SET nombre = ?, seccion = ?, asunto = ?, fecha = ?, hash = ? WHERE numero_oficio = ?';
    db.query(actualizarOficio, [nombre, seccion, asunto, fecha, hash, numero_oficio], (err) => {
        if (err) { /* ... manejo de error ... */ } 
        else { res.redirect('/'); }
    });
});


//Consulta para eliminar un oficio
router.get('/delete/:numero_oficio', (req, res) => { 
    //... (Tu lógica de /delete aquí)
    const { numero_oficio } = req.params;
    const eliminarOficio = 'DELETE FROM oficio WHERE numero_oficio = ?'; 
    db.query(eliminarOficio, [numero_oficio], (err) => { 
        if (err) { /* ... manejo de error ... */ } 
        else { res.redirect('/'); }
    });
});

module.exports = router; // <-- CAMBIO 3: Exportar el router