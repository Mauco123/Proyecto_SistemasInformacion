const express = require("express");
const session = require('express-session');
const db = require('./DB/db');
const rutas = require('./routes/rutas'); 

const app = express();
const port = 3005;


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Se configura la session para el login
//Creacion de la cookies
app.use(session({
    secret: 'secreto', 
    resave: false,
    saveUninitialized: false
}));

// Muestra el formulario de login
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

//Autentica al usuario
app.post('/auth', (req, res) => {
    const { nombre_usuario, contraseña } = req.body;
    //Se verifica si el usuario y contraseña son correctos
    if (!nombre_usuario || !contraseña) {
        return res.render('login', { error: '¡Por favor, ingresa un usuario y contraseña!' });
    }
    //Se crea la consulta para verificar si el usuario y contraseña son correctos
    const consulta = 'SELECT * FROM usuario WHERE nombre_usuario = ? AND contraseña = ?';
    db.query(consulta, [nombre_usuario, contraseña], (err, results) => {
        // Si hay un error, se lanza el error
        if (err) throw err;
        // Si el usuario y contraseña son correctos, se crea la session
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = nombre_usuario;
            res.redirect('/');
        } else {
            // Si el usuario y contraseña son incorrectos, se muestra el mensaje de error
            res.render('login', { error: '¡Usuario y/o contraseña incorrectos!' });
        }
    });
});

//Verifica si el usuario esta autenticado
const checkAuth = (req, res, next) => {
    if (req.session.loggedin) {
        next(); // Si hay sesión, continúa
    } else {
        res.redirect('/login'); // Si no, se regresa al formulario de login
    }
};

// Revisar si el usuario esta autorizado a las vistas
app.use('/', checkAuth, rutas);

//Iniciar el servidor

app.listen(port, () => {
    console.log(`Servidor iniciado en http://127.0.0.1:${port}`);
});
