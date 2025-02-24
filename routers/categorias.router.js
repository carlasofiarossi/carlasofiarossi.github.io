/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/categorias.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allCategories);

// Para un producto
router.get('/:id_categoria', controller.showCategory);

//// METODO POST  ////
router.post('/', controller.storeCategory);

//// METODO PUT  ////
router.put('/:id_categoria', controller.updateCategory);

//// METODO DELETE ////
router.delete('/:id_categoria', controller.destroyCategory);

// EXPORTAR ROUTERS
module.exports = router;

