/// CONTROLADORES DEL MODULO ///

// Campos de la tabla provincias
// id_provincia
// nombre


const db = require("../db/db");

//// METODO GET  /////

// Para todos los provincias
const allProvinces = (req, res) => {
    const sql = "SELECT * FROM provincias";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        res.json(rows);
    }); 
};

// Para una provincia
const showProvince = (req, res) => {
    const {id_provincia} = req.params;
    const sql = "SELECT * FROM provincias WHERE id_provincia = ?";
    db.query(sql,[id_provincia], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: La provincia buscado no existe."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const storeProvince = (req, res) => {
    const {nombre} = req.body;
    const sql = "INSERT INTO provincias (nombre) VALUES (?)";
    db.query(sql,[nombre], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor"});
        }
        const provincia = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(provincia); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateProvince = (req, res) => {
    const {id_provincia} = req.params;
    const {nombre} = req.body;
    const sql ="UPDATE provincias SET nombre = ? WHERE id_provincia = ?";
    db.query(sql,[nombre, id_provincia], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La provincia a modificar no existe."});
        };
        
        const provincias = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(provincias); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const destroyProvince = (req, res) => {
    const {id_provincia} = req.params;
    const sql = "DELETE FROM provincias WHERE id_provincia = ?";
    db.query(sql,[id_provincia], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La provincia borrar no existe"});
        };
        res.json({mensaje : "Provincia eliminada con exito."});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allProvinces,
    showProvince,
    storeProvince,
    updateProvince,
    destroyProvince
};
