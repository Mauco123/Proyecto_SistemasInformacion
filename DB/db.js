// DB/db.js
const mysql = require('mysql2');

// CAMBIO: Usar createPool en lugar de createConnection
const pool = mysql.createPool({
    connectionLimit: 10, // Límite de conexiones (10 es un buen default)
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'oficios_fes_aragon',
    port: 3306
});

// ELIMINADO: No necesitas db.connect() en un pool.
// El pool maneja las conexiones automáticamente cuando se le pide.

// Verificación inicial de que el pool funciona
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar al pool de la DB:', err);
        return;
    }
    console.log('Pool de conexiones MySQL conectado y listo.');
    connection.release(); // Importante: devuelve la conexión al pool
});

// Exportamos el 'pool'.
// Lo mejor es que la API de .query() es 100% compatible.
// No necesitas cambiar nada en app.js o rutas.js.
module.exports = pool;