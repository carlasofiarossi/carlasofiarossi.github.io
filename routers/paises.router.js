/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/paises.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allCountries);

// Para un producto
router.get('/:id_pais', controller.showCountry);

//// METODO POST  ////
router.post('/', controller.storeCountry);

//// METODO PUT  ////
router.put('/:id_pais', controller.updateCountry);

//// METODO DELETE ////
router.delete('/:id_pais', controller.destroyCountry);

// EXPORTAR ROUTERS
module.exports = router;

