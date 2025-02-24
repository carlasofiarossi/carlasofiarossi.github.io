/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/marcas.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allBrand);

// Para un producto
router.get('/:id_marca', controller.showBrand);

//// METODO POST  ////
router.post('/', controller.storeBrand);

//// METODO PUT  ////
router.put('/:id_marca', controller.updateBrand);

//// METODO DELETE ////
router.delete('/:id_marca', controller.destroyBrand);

// EXPORTAR ROUTERS
module.exports = router;

