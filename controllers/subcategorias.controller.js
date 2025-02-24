/// CONTROLADORES DEL MODULO ///

// Campos de la tabla subcategorias
// id_sub
// nombre
// fk_categoria


const db = require("../db/db");

//// METODO GET  /////

// Para todos las subcategorias
const allSubcategories = (req, res) => {
    const sql = `
      SELECT subcategorias.ID_Sub, subcategorias.Nombre, categorias.Nombre AS Categoria
      FROM subcategorias
      JOIN categorias ON subcategorias.FK_Categoria = categorias.ID_Categoria`
      ;
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        res.json(rows);
    }); 
};

// Para una subcategoria
const showSubcategory = (req, res) => {
    const { id_sub } = req.params;
    
    // Consulta con JOIN para obtener el nombre de la categoría
    const sql = `
      SELECT subcategorias.ID_Sub, subcategorias.Nombre, categorias.Nombre AS Categoria
      FROM subcategorias
      JOIN categorias ON subcategorias.FK_Categoria = categorias.ID_Categoria
      WHERE subcategorias.ID_Sub = ?;
    `;

    db.query(sql, [id_sub], (error, rows) => {
        console.log(rows); // 🛠 Verifica que los datos sean correctos en la consola

        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde, por favor." });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: "ERROR: La subcategoría buscada no existe." });
        }

        res.json(rows[0]); // Enviar solo la primera coincidencia
    });
};

//// METODO POST  ////
const storeSubcategory = (req, res) => {
    const {nombre, fk_categoria} = req.body;
    const sql = "INSERT INTO subcategorias (nombre, fk_categoria) VALUES (?,?)";
    db.query(sql,[nombre, fk_categoria], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor"});
        }
        const subcategoria = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(subcategoria); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateSubcategory = (req, res) => {
    const {id_sub} = req.params;
    const {nombre, fk_categoria} = req.body;
    const sql ="UPDATE subcategorias SET nombre = ?, fk_categoria =? WHERE id_sub = ?";
    db.query(sql,[nombre, fk_categoria, id_sub], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La subcategoria a modificar no existe."});
        };
        
        const subcategoria = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(subcategoria); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const destroySubcategory = (req, res) => {
    const {id_sub} = req.params;
    const sql = "DELETE FROM subcategorias WHERE id_sub = ?";
    db.query(sql,[id_sub], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La subcategoria a borrar no existe"});
        };
        res.json({mensaje : "Subcategoria eliminada con exito."});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allSubcategories,
    showSubcategory,
    storeSubcategory,
    updateSubcategory,
    destroySubcategory
};
