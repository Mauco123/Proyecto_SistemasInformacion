
const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10, 
    host: 'localhost',
    user: 'admin_fes',
    password: '123456',
    database: 'oficios_fes_aragon',
    port: 3306
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar al pool de la DB:', err);
        return;
    }
    console.log('Base de datos conectada');
    if (connection) connection.release(); 
});

module.exports = pool;