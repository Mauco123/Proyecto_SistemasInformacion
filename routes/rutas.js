const express = require('express');
const app = express();
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
    ].join('|'); // Se concatena el nombre, seccion, asunto y fecha
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Definir la ruta raiz
// Mostrar la lista de oficios
// y mostrar el formulario de agregar un nuevo oficio
app.get('/', (req, res) => {
    const consulta = 'SELECT * FROM oficio';

    db.query(consulta, (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            res.send('Error, por favor contacta a soporte técnico.');
        } else {
            res.render('index', { oficios: results });
        }
    });
});

//Agregar un nuevo oficio
app.post('/add', (req, res) => {
    const {nombre, seccion, asunto, fecha} = req.body;
    //El hash se crea aqui para pasarlo como parametro a la base de datos
    const hash = generarHash(nombre, seccion, asunto, fecha);

    //Se crea la consulta para insertar el registro en la base de datos
    const insertarRegistro = 'INSERT INTO oficio (nombre, seccion, asunto, fecha, hash) VALUES (?, ?, ?, ?, ?)';

    //Se ejecuta la consulta para insertar el registro en la base de datos
    db.query(insertarRegistro, [nombre, seccion, asunto, fecha, hash], (err, result) => {
        if (err) {
            console.error('No se pudo insertar el registro:', err);
        } else {
            res.redirect('/');
        }
    });
});

//Formulario de edicion de un oficio
app.get('/edit/:numero_oficio', (req, res) => {
    const { numero_oficio } = req.params;
    
    // Se busca el oficio seleccionado con el boton de "editar"
    const buscarOficio = 'SELECT * FROM oficio WHERE numero_oficio = ?';

    //Se ejecuta la consulta para buscar el oficio seleccionado
    db.query(buscarOficio, [numero_oficio], (err, results) => {
        if (err) {
            console.error('Error al buscar el oficio:', err);
            return res.send('Error en la base de datos');
        }
        if (results.length === 0) {
            return res.send('Oficio no encontrado');
        }
        res.render('edit', { oficio: results[0] });
    });
});


//Consulta para actualizar un oficio
app.post('/update/:numero_oficio', (req, res) => {
    // Se obtinene el numero de oficio al presionar el boton de "actualizar"
    const { numero_oficio } = req.params;
    const { nombre, seccion, asunto, fecha } = req.body;

    //El hash se crea aqui para pasarlo como parametro a la base de datos
    const hash = generarHash(nombre, seccion, asunto, fecha);

    //Se crea la consulta para actualizar el oficio
    const actualizarOficio = 'UPDATE oficio SET nombre = ?, seccion = ?, asunto = ?, fecha = ?, hash = ? WHERE numero_oficio = ?';

    //Se ejecuta la consulta para actualizar el oficio
    db.query(actualizarOficio, [nombre, seccion, asunto, fecha, hash, numero_oficio], (err) => {
        if (err) {
            console.error("Error al actualizar el oficio:", err);
            res.send("Error al actualizar");
        } else {
            res.redirect('/');
        }
    });
});


//Consulta para eliminar un oficio
app.get('/delete/:numero_oficio', (req, res) => { 
    const { numero_oficio } = req.params;
    
    //Se crea la consulta para eliminar el oficio
    const eliminarOficio = 'DELETE FROM oficio WHERE numero_oficio = ?'; 

    //Se ejecuta la consulta para eliminar el oficio
    db.query(eliminarOficio, [numero_oficio], (err) => { 
        if (err) {
            console.error('Error al eliminar el registro:', err);
            res.send("Error al eliminar el oficio");
        } else {
            res.redirect('/');
        }
    });
});

module.exports = app;