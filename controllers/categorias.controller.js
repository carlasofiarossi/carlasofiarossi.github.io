/// CONTROLADORES DEL MODULO ///

// Campos de la tabla categorias
// id_categoria
// nombre


const db = require("../db/db");

//// METODO GET  /////

// Para todos las categorias
const allCategories = (req, res) => {
    const sql = "SELECT * FROM categorias";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        res.json(rows);
    }); 
};

// Para una categoria
const showCategory = (req, res) => {
    const {id_categoria} = req.params;
    const sql = "SELECT * FROM categorias WHERE id_categoria = ?";
    db.query(sql,[id_categoria], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: La categoria buscada no existe."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const storeCategory = (req, res) => {
    const {nombre} = req.body;
    const sql = "INSERT INTO categorias (nombre) VALUES (?)";
    db.query(sql,[nombre], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor"});
        }
        const categoria = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(categoria); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateCategory = (req, res) => {
    const {id_categoria} = req.params;
    const {nombre} = req.body;
    const sql ="UPDATE categorias SET nombre = ? WHERE id_categoria = ?";
    db.query(sql,[nombre, id_categoria], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La categoria a modificar no existe."});
        };
        
        const categoria = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(categoria); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const destroyCategory = (req, res) => {
    const {id_categoria} = req.params;
    const sql = "DELETE FROM categorias WHERE id_categoria = ?";
    db.query(sql,[id_categoria], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La categoria a borrar no existe"});
        };
        res.json({mensaje : "Categoria eliminada con exito."});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allCategories,
    showCategory,
    storeCategory,
    updateCategory,
    destroyCategory
};
