/// CONTROLADORES DEL MODULO ///

// Campos de la tabla paises
// id_pais
// nombre


const db = require("../db/db");

//// METODO GET  /////

// Para todos los paises
const allCountries = (req, res) => {
    const sql = "SELECT * FROM paises";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        res.json(rows);
    }); 
};

// Para un país
const showCountry = (req, res) => {
    const {id_pais} = req.params;
    const sql = "SELECT * FROM paises WHERE id_pais = ?";
    db.query(sql,[id_pais], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: El país buscado no existe."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const storeCountry = (req, res) => {
    const {nombre} = req.body;
    const sql = "INSERT INTO paises (nombre) VALUES (?)";
    db.query(sql,[nombre], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor"});
        }
        const pais = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(pais); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateCountry = (req, res) => {
    const {id_pais} = req.params;
    const {nombre} = req.body;
    const sql ="UPDATE paises SET nombre = ? WHERE id_pais = ?";
    db.query(sql,[nombre, id_pais], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El país a modificar no existe."});
        };
        
        const paises = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(paises); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const destroyCountry = (req, res) => {
    const {id_pais} = req.params;
    const sql = "DELETE FROM paises WHERE id_pais = ?";
    db.query(sql,[id_pais], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El país borrar no existe"});
        };
        res.json({mensaje : "País eliminado con exito."});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allCountries,
    showCountry,
    storeCountry,
    updateCountry,
    destroyCountry
};
