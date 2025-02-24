/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/provincias.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allProvinces);

// Para un producto
router.get('/:id_provincia', controller.showProvince);

//// METODO POST  ////
router.post('/', controller.storeProvince);

//// METODO PUT  ////
router.put('/:id_provincia', controller.updateProvince);

//// METODO DELETE ////
router.delete('/:id_provincia', controller.destroyProvince);

// EXPORTAR ROUTERS
module.exports = router;

