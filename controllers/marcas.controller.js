/// CONTROLADORES DEL MODULO ///

// Campos de la tabla marcas
// id_marca
// nombre
// fk_pais


const db = require("../db/db");

//// METODO GET  /////

// Para todos las marca
const allBrand = (req, res) => {
    // Consulta SQL con JOIN para obtener el nombre del país en lugar del ID_Pais
    const sql = `
      SELECT marcas.ID_Marca, marcas.Nombre, paises.Nombre AS Pais
      FROM marcas
      JOIN paises ON marcas.FK_Pais = paises.ID_Pais
    `;
    
    db.query(sql, (error, rows) => {
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" });
        }
        res.json(rows); // Ahora incluye el nombre del país en lugar del ID
    });
};

// Para una marca
// Para una sola marca
const showBrand = (req, res) => {
    const { id_marca } = req.params;
    
    // Consulta con JOIN para obtener el nombre del país
    const sql = `
      SELECT marcas.ID_Marca, marcas.Nombre, paises.Nombre AS Pais
      FROM marcas
      JOIN paises ON marcas.FK_Pais = paises.ID_Pais
      WHERE marcas.ID_Marca = ?;
    `;

    db.query(sql, [id_marca], (error, rows) => {
        console.log(rows); // 🛠 Verifica que los datos sean correctos en la consola

        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde, por favor." });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: "ERROR: La marca buscada no existe." });
        }

        res.json(rows[0]); // Enviar solo la primera coincidencia
    }); 
};

const storeBrand = (req, res) => {
    const { nombre, fk_pais } = req.body;
    console.log("Datos recibidos:", { nombre, fk_pais });

    const sql = "INSERT INTO marcas (nombre, fk_pais) VALUES (?, ?)";
    db.query(sql, [nombre, fk_pais], (error, result) => {
        if (error) {
            console.log("Error al insertar:", error);
            return res.status(500).json({ error: "ERROR: Intente más tarde, por favor." });
        }
        const marca = { ...req.body, id: result.insertId }; // Reconstruir el objeto del body
        res.status(201).json(marca); // Retornar la marca con el ID generado
    });
};
//// METODO PUT  ////
const updateBrand = (req, res) => {
    const {id_marca} = req.params;
    const {nombre, fk_pais} = req.body;
    const sql ="UPDATE marcas SET nombre = ?, fk_pais =? WHERE id_marca = ?";
    db.query(sql,[nombre, fk_pais, id_marca], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La marca a modificar no existe."});
        };
        
        const marca = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(marca); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const destroyBrand = (req, res) => {
    const {id_marca} = req.params;
    const sql = "DELETE FROM marcas WHERE id_marca = ?";
    db.query(sql,[id_marca], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La marca a borrar no existe"});
        };
        res.json({mensaje : "Marca eliminada con exito."});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allBrand,
    showBrand,
    storeBrand,
    updateBrand,
    destroyBrand
};
