/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/articulos.controller");

//// MULTER ///
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'uploads'); // carpeta de destino para las imágenes cargadas
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname)); //nombre único para cada archivo, son los segundos desde 1970
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        console.log(file);
        const fileTypes = /jpg|jpeg|png/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Tipo de archivo no soportado");
    },
    limits: {fileSize: 1024 * 1024 * 1}, // aprox 1Mb
});

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allArticle);

// Para un producto
router.get('/:id_articulo', controller.showArticle);

//// METODO POST  ////
router.post('/', upload.single('imagen'), controller.storeArticle);


//// METODO DELETE ////
router.delete('/:id_articulo', controller.destroyArticle);

// 👉 Obtener subcategorías por ID de categoría
router.get('/subcategorias/:categoriaId', controller.getSubcategories);

// 👉 Obtener tipos por ID de subcategoría
router.get('/tipos/:subcategoriaId', controller.getTypes);

//// METODO PUT  ////
router.put('/:id_articulo', upload.single('imagen'), controller.updateArticle);

// EXPORTAR ROUTERS
module.exports = router;

