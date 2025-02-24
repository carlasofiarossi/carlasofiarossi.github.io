/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();
const db = require("../db/db");


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


//// AUTH ////
const controller = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware")

//// METODO POST  ////
router.post('/register', upload.single('imagen'), controller.register);
router.post('/login', controller.login);

router.get("/protected", authMiddleware, (req, res) => {
    const userId = req.userId;

    // Consultar la base de datos para obtener el nombre del usuario
    const sql = "SELECT nombre FROM login WHERE id_login = ?";
    db.query(sql, [userId], (error, results) => {
        if (error) {
            console.error("Error al obtener el nombre del usuario:", error);
            return res.status(500).send("Error al obtener la información del usuario.");
        }

        if (results.length == 0) {
            return res.status(404).send("Usuario no encontrado.");
        }

        const nombre = results[0].nombre;
        res.status(200).send(`¡Hola, ${nombre}!`);
    });
});



// EXPORTAR ROUTERS
module.exports = router;

