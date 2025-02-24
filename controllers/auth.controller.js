/// CONTROLADORES DEL MODULO ///

// Campos de la tabla login
// id_login(int(11))
// nombre(varchar(20))
// apellido(varchar(20))
// fk_provincia(int(10))
// fk_pronombre(int(10))
// celular(int(20))
// mail(varchar(30))
//password(varchar(60))
//imagen(varchar(255):null)

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/db"); // Importar la conexión a la base de datos

// Función para registrar usuario
const register = (req, res) => {
    console.log("Cuerpo de la solicitud:", req.body); // Verifica los datos que llegan
    console.log("Imagen:", req.file); // Verifica si la imagen se está subiendo correctamente
    let imageName = req.file ? req.file.filename : null; // Manejo de la imagen

    const { nombre, apellido, fk_provincia, fk_pronombre, celular, mail, password } = req.body;

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM login WHERE Mail = ?', [mail], (error, results) => {
        if (error) {
            console.error("Registration error:", error);
            return res.status(500).json({ message: "Error checking user existence" });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "Ya existe un usuario con ese mail." });

        }

        // Encriptar la contraseña
        bcrypt.hash(password, 8, (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).send("Error hashing password");
            }

            // Insertar nuevo usuario en la base de datos
            db.query(
                'INSERT INTO login (nombre, apellido, fk_provincia, fk_pronombre, celular, mail, password, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [nombre, apellido, fk_provincia, fk_pronombre, celular, mail, hash, imageName],
                (insertError, insertResults) => {
                    if (insertError) {
                        console.error("Error inserting user:", insertError);
                        return res.status(500).send("Error registering user");
                    }

                    // Obtener el ID del usuario recién creado
                    const userId = insertResults.insertId;

                    // Generar un token JWT con el ID del usuario
                    const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
                        expiresIn: "1h",
                    });

                    // Enviar la respuesta con el token
                    res.status(201).send({ auth: true, token });
                }
            );
        });
    });
};


// Función para hacer login
const login = (req, res) => { 
    const { mail, password } = req.body;

    // Buscar al usuario por correo electrónico
    db.query('SELECT ID_Login, Nombre, Apellido, Mail, Password FROM login WHERE Mail = ?', [mail], (error, results) => {
        if (error) {
            console.error("Login error:", error);
            return res.status(500).send("Error during login");
        }

        // Verificar si el usuario existe
        if (results.length === 0) {
            return res.status(404).send("User not found.");
        }

        const user = results[0];
        console.log("Retrieved user:", user);

        // Verificar que la contraseña no esté vacía o indefinida
        if (!user.Password) {
            console.error("Password not set for this user.");
            return res.status(500).send("Password not set for this user.");
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        bcrypt.compare(password, user.Password, (err, passwordIsValid) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).send("Error comparing passwords");
            }

            if (!passwordIsValid) {
                return res.status(401).send({ auth: false, token: null });
            }

            // Generar un token JWT con el ID del usuario
            const token = jwt.sign({ id: user.ID_Login }, process.env.SECRET_KEY, {
                expiresIn: "1h",
            });

            // Enviar la respuesta con el token y los datos del usuario
            res.send({
                auth: true,
                token: token,
                Nombre: user.Nombre,   // Añadir el nombre del usuario a la respuesta
                Apellido: user.Apellido  // Añadir el apellido del usuario a la respuesta
            });
        });
    });
};

module.exports = {
    register,
    login,
};
