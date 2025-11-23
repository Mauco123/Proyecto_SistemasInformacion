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



router.get('/', (req, res) => {
    console.log(`[LOG] Usuario ${req.session.username} pidiendo GET /`); 

    const consulta = 'SELECT * FROM oficio';

    db.query(consulta, (err, results) => {
        console.log("[LOG] Callback de 'SELECT * FROM oficio' EJECUTADO."); 

        if (err) {
            console.error('Error al consultar la base de datos:', err);
            res.send('Error, por favor contacta a soporte técnico.');
        } else {
            console.log(`[LOG] Renderizando index.ejs con ${results.length} oficios.`); 
            res.render('index', { oficios: results, username: req.session.username }); 
        }
    });
});


//Agregar un nuevo oficio
router.post('/add', (req, res) => {
    const {nombre, seccion, asunto, fecha} = req.body;
    const hash = generarHash(null, nombre, seccion, asunto, fecha); 

    const insertarRegistro = 'INSERT INTO oficio (nombre, seccion, asunto, fecha, hash) VALUES (?, ?, ?, ?, ?)';
    db.query(insertarRegistro, [nombre, seccion, asunto, fecha, hash], (err, result) => {
        if (err) {
            console.error('No se pudo insertar el registro:', err);
            res.send("Error al insertar"); 
        } else {
            res.redirect('/');
        }
    });
});

//Formulario de edicion de un oficio
router.get('/edit/:numero_oficio', (req, res) => {
    
    const { numero_oficio } = req.params;
    const buscarOficio = 'SELECT * FROM oficio WHERE numero_oficio = ?';
    db.query(buscarOficio, [numero_oficio], (err, results) => {
        if (err) { }
        if (results.length === 0) { }
        res.render('edit', { oficio: results[0] });
    });
});

//hacer el cambio
router.post('/update/:numero_oficio', (req, res) => {
    const { numero_oficio } = req.params;
    const { nombre, seccion, asunto, fecha } = req.body;
    const hash = generarHash(numero_oficio, nombre, seccion, asunto, fecha);
    const actualizarOficio = 'UPDATE oficio SET nombre = ?, seccion = ?, asunto = ?, fecha = ?, hash = ? WHERE numero_oficio = ?';
    db.query(actualizarOficio, [nombre, seccion, asunto, fecha, hash, numero_oficio], (err) => {
        if (err) { } 
        else { res.redirect('/'); }
    });
});

//eliminar
router.get('/delete/:numero_oficio', (req, res) => { 
    
    const { numero_oficio } = req.params;
    const eliminarOficio = 'DELETE FROM oficio WHERE numero_oficio = ?'; 
    db.query(eliminarOficio, [numero_oficio], (err) => { 
        if (err) {  } 
        else { res.redirect('/'); }
    });
});

module.exports = router; 