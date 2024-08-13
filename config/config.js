
const mysql = require('mysql2');

const db  = mysql.createConnection({
    host: 'localhost', //transportexpresshn.mysql.database.azure.com
    user: 'root', //TraexServerMySQL
    password: '',//pa$$word.2024
    database: 'traex_db',
    //ssl: true // Es importante establecer esta opción en true para conexiones seguras a Azure MySQL
});

db.connect(function(err) {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        throw err;
    }
    console.log('Conexión exitosa a la base de datos MySQL en Azure');
});

module.exports = db;
