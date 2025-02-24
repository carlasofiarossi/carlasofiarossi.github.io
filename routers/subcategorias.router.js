/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/subcategorias.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allSubcategories);

// Para un producto
router.get('/:id_sub', controller.showSubcategory);

//// METODO POST  ////
router.post('/', controller.storeSubcategory);

//// METODO PUT  ////
router.put('/:id_sub', controller.updateSubcategory);

//// METODO DELETE ////
router.delete('/:id_sub', controller.destroySubcategory);

// EXPORTAR ROUTERS
module.exports = router;

