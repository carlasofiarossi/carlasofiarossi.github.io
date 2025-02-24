/// CONTROLADORES DEL MODULO ///

// Campos de la tabla articulos
// id_producto
// nombre
// fk_categoria
// fk_subcategoria
// fk_tipo
// fk_marca
// descripcion
// precio

const db = require("../db/db");

//// METODO GET  /////

// Para todos las articulos
const allArticle = (req, res) => {
    const sql = `
      SELECT 
          articulos.ID_Articulo, 
          articulos.Nombre, 
          categorias.Nombre AS Categoria, 
          subcategorias.Nombre AS Subcategoria, 
          tipos.Nombre AS Tipo, 
          marcas.Nombre AS Marca, 
          articulos.Descripcion, 
          articulos.Precio,
           articulos.Imagen
      FROM articulos
      JOIN categorias ON articulos.FK_Categoria = categorias.ID_Categoria
      JOIN subcategorias ON articulos.FK_Subcategoria = subcategorias.ID_Sub
      JOIN tipos ON articulos.FK_Tipo = tipos.ID_Tipo
      JOIN marcas ON articulos.FK_Marca = marcas.ID_Marca;
    `;

    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."}); //si ocurre un error al ejecutar la consulta en la base de datos se envía una
        }                                                                                //respuesta en formato JSON al cliente indicando que hubo un fallo en el servidor.
        res.json(rows);
    }); 
};
// Para un artículo específico
const showArticle = (req, res) => {
    const { id_articulo } = req.params;
    const sql = `
      SELECT 
          articulos.ID_Articulo, 
          articulos.Nombre, 
          categorias.Nombre AS Categoria, 
          subcategorias.Nombre AS Subcategoria, 
          tipos.Nombre AS Tipo, 
          marcas.Nombre AS Marca, 
          articulos.Descripcion, 
          articulos.Precio,
          articulos.Imagen
      FROM articulos
      JOIN categorias ON articulos.FK_Categoria = categorias.ID_Categoria
      JOIN subcategorias ON articulos.FK_Subcategoria = subcategorias.ID_Sub
      JOIN tipos ON articulos.FK_Tipo = tipos.ID_Tipo
      JOIN marcas ON articulos.FK_Marca = marcas.ID_Marca
      WHERE articulos.ID_Articulo = ?`; // Filtro por ID_Articulo

    db.query(sql, [id_articulo], (error, rows) => {
        console.log(rows); // Para depuración, verifica qué devuelve la consulta
        if (error) {
            return res.status(500).json({ error: "ERROR: Intente más tarde, por favor." });
        }
        if (rows.length == 0) {
            return res.status(404).send({ error: "ERROR: El artículo buscado no existe." });
        }
        res.json(rows[0]); // Retorna el artículo encontrado
    });
};

//// METODO POST  ////
// Método POST para almacenar un artículo con imagen
const storeArticle = (req, res) => {
    console.log("Imagen:", req.file); // Verifica si la imagen se está subiendo correctamente

    // Verificar si la imagen ha sido cargada
    if (!req.file) {
        return res.status(400).json({ error: "ERROR: La foto es obligatoria." });
    }

    let imageName = req.file.filename;  // Nombre de la imagen
    let imagePath = req.file.path;      // Ruta completa de la imagen
    const {nombre, fk_categoria, fk_subcategoria, fk_tipo, fk_marca, descripcion, precio} = req.body;

    const sql = "INSERT INTO articulos (nombre, fk_categoria, fk_subcategoria, fk_tipo, fk_marca, descripcion, precio, imagen) VALUES (?,?,?,?,?,?,?,?)";
    db.query(sql, [nombre, fk_categoria, fk_subcategoria, fk_tipo, fk_marca, descripcion, precio, imageName], (error, result) => {
        if (error) {
            console.error("Error de base de datos:", error); // Log de error
            return res.status(500).json({error : "ERROR: Intente más tarde, por favor."});
        }

        const articulo = {...req.body, id: result.insertId, imagen: imagePath};  // Incluir la imagen en el objeto de respuesta
        console.log("Articulo guardado:", articulo); // Log de artículo guardado
        res.status(201).json(articulo); // Mostrar creado con éxito el artículo
    });
};



//// METODO PUT  ////
// Método PUT para actualizar un artículo
const updateArticle = (req, res) => {
    const { id_articulo } = req.params;
    const { nombre, fk_categoria, fk_subcategoria, fk_tipo, fk_marca, descripcion, precio } = req.body;

    // Primero, obtener la imagen actual del artículo desde la base de datos
    let imagen = null;
    if (req.file) {
        imagen = req.file.filename; // Nueva imagen cargada
    } else {
        // Si no hay imagen cargada, mantenemos la imagen previa
        const sqlGetImage = `SELECT imagen FROM articulos WHERE id_articulo = ?`;
        db.query(sqlGetImage, [id_articulo], (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "ERROR: Intente más tarde, por favor." });
            }

            if (result.length === 0) {
                return res.status(404).send({ error: "ERROR: El artículo a modificar no existe." });
            }

            imagen = result[0].imagen; // Mantener la imagen previa

            const sqlUpdate = `
                UPDATE articulos
                SET nombre = ?, fk_categoria = ?, fk_subcategoria = ?, fk_tipo = ?, fk_marca = ?, descripcion = ?, precio = ?, imagen = ?
                WHERE id_articulo = ?
            `;

            db.query(sqlUpdate, [nombre, fk_categoria, fk_subcategoria, fk_tipo, fk_marca, descripcion, precio, imagen, id_articulo], (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: "ERROR: Intente más tarde, por favor." });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).send({ error: "ERROR: El artículo a modificar no existe." });
                }

                const articulo = { id_articulo, nombre, fk_categoria, fk_subcategoria, fk_tipo, fk_marca, descripcion, precio, imagen };
                res.json(articulo); // Enviar el artículo actualizado como respuesta
            });
        });
        return; // Evitar continuar con el código mientras se obtiene la imagen
    }

    // Si se subió una nueva foto, se actualiza normalmente
    const sql = `
        UPDATE articulos
        SET nombre = ?, fk_categoria = ?, fk_subcategoria = ?, fk_tipo = ?, fk_marca = ?, descripcion = ?, precio = ?, imagen = ?
        WHERE id_articulo = ?
    `;

    db.query(sql, [nombre, fk_categoria, fk_subcategoria, fk_tipo, fk_marca, descripcion, precio, imagen, id_articulo], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "ERROR: Intente más tarde, por favor." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "ERROR: El artículo a modificar no existe." });
        }

        const articulo = { id_articulo, nombre, fk_categoria, fk_subcategoria, fk_tipo, fk_marca, descripcion, precio, imagen };
        res.json(articulo); // Enviar el artículo actualizado como respuesta
    });
};


//// METODO DELETE ////
const destroyArticle = (req, res) => {
    const {id_articulo} = req.params;
    const sql = "DELETE FROM articulos WHERE id_articulo = ?";
    db.query(sql,[id_articulo], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde, por favor."});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El articulo a borrar no existe"});
        };
        res.json({mensaje : "Articulo eliminado con exito."});
    }); 
};


//// METODOS ADICIONALES PARA FILTRO DINÁMICO  ////

// Obtener subcategorías según la categoría seleccionada
const getSubcategories = (req, res) => {
    const { categoriaId } = req.params;
    const sql = `SELECT ID_Sub, Nombre FROM subcategorias WHERE FK_Categoria = ?`;

    db.query(sql, [categoriaId], (error, rows) => {
        if (error) return res.status(500).json({ error: "Error al obtener subcategorías" });
        res.json(rows);
    });
};

// Obtener tipos según la subcategoría seleccionada
const getTypes = (req, res) => {
    const { subcategoriaId } = req.params;
    const sql = `SELECT ID_Tipo, Nombre FROM tipos WHERE FK_Subcategoria = ?`;

    db.query(sql, [subcategoriaId], (error, rows) => {
        if (error) return res.status(500).json({ error: "Error al obtener tipos" });
        res.json(rows);
    });
};
// EXPORTAR TODAS LAS FUNCIONES
module.exports = {
    allArticle,
    showArticle,
    storeArticle,
    updateArticle,
    destroyArticle,
    getSubcategories,  // ✅ Exportamos la función
    getTypes           // ✅ Exportamos la función
};