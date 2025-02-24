/// CONTROLADORES DEL MODULO ///

// Campos de la tabla tipos
// id_tipo
// nombre
// fk_subcategoria


const db = require("../db/db");

//// METODO GET  /////

// Para todos los tipos
const allTypes = (req, res) => {
    const sql = `
      SELECT tipos.ID_Tipo, tipos.Nombre, subcategorias.Nombre AS Subcategoria
      FROM tipos
      JOIN subcategorias ON tipos.FK_Subcategoria = subcategorias.ID_Sub
    `;
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        res.json(rows);
    }); 
};

// Para un tipo
const showType = (req, res) => {
    const {id_tipo} = req.params;
    const sql = `
      SELECT tipos.ID_Tipo, tipos.Nombre, subcategorias.Nombre AS Subcategoria
      FROM tipos
      JOIN subcategorias ON tipos.FK_Subcategoria = subcategorias.ID_Sub
      WHERE tipos.ID_Tipo = ?;
    `;
    db.query(sql,[id_tipo], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: El tipo buscado no existe."});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const storeType = (req, res) => {
    const {nombre, fk_subcategoria} = req.body;
    const sql = "INSERT INTO tipos (nombre, fk_subcategoria) VALUES (?,?)";
    db.query(sql,[nombre, fk_subcategoria], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor"});
        }
        const tipo = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(tipo); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateType = (req, res) => {
    const {id_tipo} = req.params;
    const {nombre, fk_subcategoria} = req.body;
    const sql ="UPDATE tipos SET nombre = ?, fk_subcategoria =? WHERE id_tipo = ?";
    db.query(sql,[nombre, fk_subcategoria, id_tipo], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El tipo a modificar no existe."});
        };
        
        const tipo = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(tipo); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const destroyType = (req, res) => {
    const {id_tipo} = req.params;
    const sql = "DELETE FROM tipos WHERE id_tipo = ?";
    db.query(sql,[id_tipo], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El tipo a borrar no existe"});
        };
        res.json({mensaje : "Tipo eliminado con exito."});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allTypes,
    showType,
    storeType,
    updateType,
    destroyType
};
