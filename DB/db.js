const mysql = require('mysql2');

//conexion a la base de datos 
const db = mysql.createConnection({
    host: 'localhost',//server
    user: 'root',//usuario
    password: '123456',//contraseña
    database: 'oficios_fes_aragon',//nombre de la base de datos
    port: 3306//puerto
});


//validacion de la conexion a la DB
db.connect((err)=>{
    if(err){
        console.log('Sin conexion a la DB',err);
    }else{
        console.log('Base de datos para oficios conectada conectada');
    }
});


//exportar la variable db para ser utilizada en otros archivos
module.exports = db;

