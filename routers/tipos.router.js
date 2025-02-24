/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/tipos.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allTypes);

// Para un producto
router.get('/:id_tipo', controller.showType);

//// METODO POST  ////
router.post('/', controller.storeType);

//// METODO PUT  ////
router.put('/:id_tipo', controller.updateType);

//// METODO DELETE ////
router.delete('/:id_tipo', controller.destroyType);

// EXPORTAR ROUTERS
module.exports = router;

