const Usuarios = require('../models/Usuarios');
const ProyectosCompartidos = require('../models/ProyectosCompartidos');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { v4: uuid } = require('uuid');
const fs = require('fs');

/* FORMULARIOS */
exports.formularioRegistro = (req, res) => {
    res.render('formularioRegistro', {
        nombrePagina: "Registrarse en WorkFlow",
        titulo: "Crear cuenta en WorkFlow",
        actionForm: "/registrarse"
    });
}
exports.formularioEditarCuenta = async(req, res, next) => {
    const usuario = await Usuarios.findOne({ where: { id_usuario: res.locals.usuario.id_usuario } });
    res.render('formularioRegistro', {
        nombrePagina: "WorkFlow - Editar cuenta",
        titulo: "Editar cuenta",
        actionForm: "/mi-cuenta/editar",
        editar: true,
        usuario
    });
}
exports.formularioEditarPassword = async(req, res, next) => {
    res.render('confirmarIdentidad');
}
exports.formularioEliminarCuenta = async(req, res, next) => {
    res.render('formularioReestablecer', {
        nombrePagina: "WorkFlow - Eliminar cuenta",
        titulo: "ELIMINAR CUENTA",
        actionForm: "/mi-cuenta/eliminar",
        eliminar: true
    });
}

exports.crearCuenta = async(req, res, next) => {
    const { nombre_usuario, email, password } = req.body;
    const correoExiste = await Usuarios.findOne({ where: { email } });
    if (correoExiste) {
        const error = "Usuario ya registrado con ese correo";
        res.render('formularioRegistro', {
            nombrePagina: "Registrarse en WorkFlow",
            titulo: "Crear cuenta en WorkFlow",
            actionForm: "/registrarse",
            error
        });
    } else {
        const token = crypto.randomBytes(20).toString('hex');
        await Usuarios.create({ nombre_usuario, email, password, token });
        async function main() {
            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_SERVICE,
                secureConnection: false,
                port: 587,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                },
                tls: {
                    ciphers: 'SSLv3'
                }
            });
            const activacionUrl = `http://${req.headers.host}/mi-cuenta/activar/${token}`;

            let info = await transporter.sendMail({
                from: process.env.EMAIL_FROM, // Remitente
                to: email, // Destinatario(s)
                subject: "Activar cuenta", // Asunto
                text: "Hello world?", // Plain text body
                html: `
                    <div style="background-color:#23374d; padding:2rem;margin:0 auto;">
                        <h1 style="color:#8de4af;font-family:'Arial',sans-serif">WorkFlow</h1>
                        <p style="color:#fbfbfb;font-family:'Arial',sans-serif">¡Hola! Da click en el siguiente enlace para terminar la activación de tu cuenta.</p>
                        <a style="color:#fbfbfb;font-family:'Arial',sans-serif" href="#" target="_blank">${activacionUrl}</a>
                        <br>
                        <br>
                        <b style="color:#fbfbfb;font-family:'Arial',sans-serif">¡Muchas gracias!</b>
                    </div>
                `, // HTML body
            });
        }
        main().catch(console.error);
        res.render('login', {
            nombrePagina: 'WorkFlow',
            fondo: 'login.gif',
            loading: false,
            mensaje: "Ya casi está listo. Te enviamos un correo para terminar la activación de tu cuenta :)"
        });
    }
}

exports.editarCuenta = async(req, res, next) => {
    const { nombre_usuario, email } = req.body;
    const correoExiste = await Usuarios.findOne({ where: { email } });
    const usuario = await Usuarios.findOne({ where: { id_usuario: res.locals.usuario.id_usuario } });
    if (correoExiste) {
        if (correoExiste.email != email) {
            res.render('formularioRegistro', {
                nombrePagina: "WorkFlow - Editar cuenta",
                titulo: "Editar cuenta",
                actionForm: "/mi-cuenta/editar",
                editar: true,
                usuario,
                error: "Usuario ya registrado con ese correo"
            });
            return next();
        }
    }
    let password = req.body.confirmarpassword;
    password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    let imagen_perfil = usuario.imagen_perfil;
    if (req.body.imagen) {
        const rutaImagen = __dirname + `/../public/profilePics/${imagen_perfil}`;
        fs.unlink(rutaImagen, (err) => {
            if (err && err.code == 'ENOENT') {
                console.log("El archivo ya no existe.");
            } else if (err) {
                // Otros errores
                console.log("Ocurrió un error:")
                console.log(err);
            } else {
                console.log("Se eliminó el archivo.");
            }
        });
        imagen_perfil = req.body.imagen;
    }
    const usuarioActualizado = await Usuarios.update({
        nombre_usuario,
        email,
        password,
        imagen_perfil
    }, {
        where: {
            id_usuario: res.locals.usuario.id_usuario
        }
    });
    if (usuarioActualizado) return res.redirect('/');
}

exports.eliminarCuenta = async(req, res, next) => {
    const usuario = await Usuarios.findOne({ where: { id_usuario: res.locals.usuario.id_usuario } });
    if (usuario) {
        const idProyectos = await ProyectosCompartidos.findAll({
            where: {
                usuarioIdUsuario: usuario.id_usuario,
                rol: "owner"
            },
            attributes: ['proyectoIdProyecto']
        });
        for (let i = 0; i < idProyectos.length; i++) {
            let proyecto = await Proyectos.findOne({
                where: { id_proyecto: idProyectos[0].proyectoIdProyecto },
                attributes: ['id_proyecto']
            });
            await Tareas.destroy({
                where: {
                    proyectoIdProyecto: proyecto.id_proyecto
                }
            })
            await proyecto.destroy();
        }
        await ProyectosCompartidos.destroy({
            where: { usuarioIdUsuario: usuario.id_usuario }
        })
        await Usuarios.destroy({
            where: { id_usuario: usuario.id_usuario }
        })
        return next();
    }
    return res.render('formularioRegistro', {
        nombrePagina: "WorkFlow - Editar cuenta",
        titulo: "Editar cuenta",
        actionForm: "/mi-cuenta/editar",
        editar: true,
        usuario,
        error: "No se pudo eliminar tu cuenta."
    });
}

exports.validarCuenta = async(req, res, next) => {
    // VALIDAR ESPACIOS VACIOS
    req.checkBody('nombre_usuario').trim().notEmpty().withMessage("Debe de indicar un nombre de usuario.");
    req.checkBody('email').trim().notEmpty().isEmail().withMessage("Ingrese un correo válido.");
    req.checkBody('password').trim().notEmpty().withMessage("El password es obligatorio.");
    req.checkBody('confirmarpassword').trim().notEmpty().withMessage("Confirmar el password es obligatorio.");
    // VALIDAR LONGITUD
    req.checkBody('nombre_usuario', 'El nombre de usuario debe ser entre 3 y 60 caracteres.').isLength({ min: 3, max: 60 });
    req.checkBody('email', 'El correo no debe ser mayor a 60 caracteres.').isLength({ min: 5, max: 60 });
    req.checkBody('password', 'El password debe ser entre 7 y 60 caracteres.').isLength({ min: 7, max: 60 });
    // COMPARAR PASSWORDS
    req.checkBody('password').equals(req.body.confirmarpassword).withMessage("Los passwords no coinciden");
    const errores = req.validationErrors();
    if (errores) {
        if (res.locals.usuario.id_usuario) { // SI ES EDITAR
            const usuario = await Usuarios.findOne({ where: { id_usuario: res.locals.usuario.id_usuario } });
            res.render('formularioRegistro', {
                nombrePagina: "WorkFlow - Editar cuenta",
                titulo: "Editar cuenta",
                actionForm: "/mi-cuenta/editar",
                editar: true,
                usuario,
                errores
            });
            const rutaImagen = __dirname + `/../public/profilePics/${req.body.imagen}`;
            fs.unlink(rutaImagen, (err) => {
                if (err && err.code == 'ENOENT') {
                    // File doesn't exist
                    console.log("El archivo ya no existe.");
                } else if (err) {
                    // Otros errores
                    console.log("Ocurrió un error:")
                    console.log(err);
                } else {
                    console.log("Se eliminó el archivo.");
                }
            });
            res.status(401);
            return;
        } else { // SI ES REGISTRAR
            res.render('formularioRegistro', {
                nombrePagina: "WorkFlow - Registrarse",
                titulo: "Crear cuenta en WorkFlow",
                actionForm: "/registrarse",
                editar: false,
                errores
            });
            res.status(401);
            return;
        }
    }
    // SANITIZAR CAMPOS
    req.sanitizeBody('nombre_usuario').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    return next();
}

// Validacion de la imagen con multer
exports.validarImagen = (req, res, next) => {
    upload(req, res, function(error) {
        // Esta funcion corre despues de toda la validacion con la configuracion de multer.
        if (error instanceof multer.MulterError) {
            return next();
        }
        next(); // Con next enviamos el archivo y el request con nuestra propiedad nombreImagen
    });
}

const configMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '/../public/profilePics');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1]; // Capturar extension de la imagen
            // Agregar propiedad al request
            req.body.imagen = `${uuid()}.${extension}`;
            cb(null, req.body.imagen); // Mandar el nombre de la imagen mediante el callback
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
            cb(null, true);
        } else {
            cb(null, false);
        }
        // Poner filtro de 368px por 368px
    }
}
const upload = multer(configMulter).single('imagen');