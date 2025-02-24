/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/pronombres.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allPronouns);

// Para un producto
router.get('/:id_pronombre', controller.showPronoun);

//// METODO POST  ////
router.post('/', controller.storePronoun);

//// METODO PUT  ////
router.put('/:id_pronombre', controller.updatePronoun);

//// METODO DELETE ////
router.delete('/:id_pronombre', controller.destroyPronoun);

// EXPORTAR ROUTERS
module.exports = router;

