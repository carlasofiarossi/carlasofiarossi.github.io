/// CONTROLADORES DEL MODULO ///

// Campos de la tabla pronombres 
// id_pronombre
// nombre


const db = require("../db/db");

//// METODO GET  /////

// Para todos los pronombres
const allPronouns = (req, res) => {
    const sql = "SELECT * FROM pronombres";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        res.json(rows);
    }); 
};

// Para un pronombre
const showPronoun = (req, res) => {
    const {id_pronombre} = req.params;
    const sql = "SELECT * FROM pronombres WHERE id_pronombre = ?";
    db.query(sql,[id_pronombre], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: El pronombre buscado no existe."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const storePronoun = (req, res) => {
    const {nombre} = req.body;
    const sql = "INSERT INTO pronombres (nombre) VALUES (?)";
    db.query(sql,[nombre], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor"});
        }
        const pronombre = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(pronombre); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updatePronoun = (req, res) => {
    const {id_pronombre} = req.params;
    const {nombre} = req.body;
    const sql ="UPDATE pronombres SET nombre = ? WHERE id_pronombre = ?";
    db.query(sql,[nombre, id_pronombre], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El pronombre a modificar no existe."});
        };
        
        const pronombres = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(pronombres); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const destroyPronoun = (req, res) => {
    const {id_pronombre} = req.params;
    const sql = "DELETE FROM pronombres WHERE id_pronombre = ?";
    db.query(sql,[id_pronombre], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El país borrar no existe"});
        };
        res.json({mensaje : "Pronombre eliminado con exito."});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allPronouns,
    showPronoun,
    storePronoun,
    updatePronoun,
    destroyPronoun
};
