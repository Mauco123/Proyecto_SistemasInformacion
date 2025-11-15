// DB/db.js
const mysql = require('mysql2');

// 1. Usar mysql.createPool (forma correcta)
const pool = mysql.createPool({
    connectionLimit: 10, // Límite de conexiones (esto es correcto aquí)
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'oficios_fes_aragon',
    port: 3306
});

// 2. Verificación (opcional, pero buena idea)
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar al pool de la DB:', err);
        return;
    }
    console.log('Pool de conexiones MySQL conectado y listo.');
    if (connection) connection.release(); // Importante: devuelve la conexión al pool
});

// 3. Exportamos el 'pool'.
// Como dicen tus comentarios, la API es compatible (puedes usar pool.query(...))
module.exports = pool;