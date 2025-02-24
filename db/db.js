const mysql = require("mysql2");

//// CONEXION A LA BBDD ////
const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "productos"
});

connection.connect((error) => {
    if(error){
        return console.error(error);
    }
    console.log("Estamos conectados a la Base de Datos - productos");
});

// EXPORTAR DEL MODULO LA FUNCION CONNECTION
module.exports = connection;
