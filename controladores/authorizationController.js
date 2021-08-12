// Importar
const Usuarios = require('../modelos/Usuarios');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { v4: uuid } = require('uuid');
const fs = require('fs');

exports.loginPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('login', {
        nombrePagina: 'WorkFlow',
        fondo: 'login.gif',
        loading: false
    });
}

exports.formularioRegistro = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('formularioRegistro', {
        nombrePagina: "Registrarse en WorkFlow",
        titulo: "Crear cuenta en WorkFlow",
        actionForm: "/registrarse",
        editar: false
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

exports.crearCuenta = async(req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    console.log(req.body);
    console.log(req.params);
    return;
    const { nombre_usuario, email, password } = req.body;
    const correoExiste = await Usuarios.findOne({ where: { email } });
    if (correoExiste) {
        const error = "Usuario ya registrado con ese correo";
        res.render('formularioRegistro', {
            nombrePagina: "Registrarse en WorkFlow",
            error
        });
    } else {
        const token = crypto.randomBytes(20).toString('hex');
        await Usuarios.create({ nombre_usuario, email, password, token });
        async function main() {
            let transporter = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "84fda2e06df08d",
                    pass: "e7e2c6c7dd0613"
                }
            });
            const activacionUrl = `http://${req.headers.host}/mi-cuenta/activar/${token}`;
            let info = await transporter.sendMail({
                from: '"Gerardo Flores 👻" <from@example.com>', // Remitente
                to: "to@example.com", // Destinatario(s)
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
    if (correoExiste) {
        if (correoExiste.email != email) {
            const usuario = await Usuarios.findOne({ where: { id_usuario: res.locals.usuario.id_usuario } });
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
    let password = req.body.password;
    password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    if (req.body.imagen) {
        var imagen_perfil = req.body.imagen;
    } else {
        var imagen_perfil = null;
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
    if (usuarioActualizado) {
        return res.redirect(`/`);
    }
}

exports.activarCuenta = async(req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    const usuario = await Usuarios.findOne({ where: { token: req.params.token } });
    usuario.activo = 1;
    usuario.token = null;
    usuario.save();
    res.render('login', {
        nombrePagina: 'WorkFlow',
        fondo: 'login.gif',
        loading: false,
        mensaje: "¡Tu cuenta ha sido activada!"
    });
}

exports.verificarUsuario = (req, res, next) => passport.authenticate('local', function(err, user, info) {
    (err) ? console.log(err): '';
    if (!user) {
        // Failure message
        res.render('login', {
            nombrePagina: 'WorkFlow',
            fondo: 'failedLogin.gif',
            failedLogin: true
        });
        return next();
    }
    if (user.activo == 0) {
        res.render('login', {
            nombrePagina: 'WorkFlow',
            fondo: 'login.gif',
            mensaje: "Checa tu correo para terminar de activar tu cuenta :)"
        });
        return next();
    }
    req.logIn(user, function(err) {
        // Success
        (err) ? console.log(err): '';
        return res.render('login', {
            nombrePagina: "WorkFlow",
            fondo: 'login.gif',
            loading: true
        });
    });
})(req, res, next);

// Verificar que haya sido autenticado para acceder a las paginas
exports.usuarioVerificado = (req, res, next) => {
    // Autenticado
    if (req.isAuthenticated()) {
        return next();
    }
    // No autenticado
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

// Reestablecer password
exports.formularioReestablecerPassword = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    if (req.params.token) {
        res.render('formularioReestablecer', {
            nombrePagina: "WorkFlow",
            titulo: "Reestablecer password",
            reestablecer: true,
            formAction: `/reestablecer-password/${req.params.token}`
        });
    } else {
        // Pa enviar el correo
        res.render('formularioReestablecer', {
            nombrePagina: "WorkFlow",
            titulo: "Reestablecer password",
            reestablecer: false,
            formAction: "/reestablecer-password"
        });
    }
}

exports.activarToken = async(req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    const usuario = await Usuarios.findOne({ where: { email: req.body.email } });
    // Si el usuario no existe
    if (!usuario) {
        console.log("No existe usuario.");
        res.render('formularioReestablecer', {
            nombrePagina: "WorkFlow",
            titulo: "Reestablecer password",
            reestablecer: false,
            error: "Esa cuenta no existe"
        });
        return next();
    }
    // Generar token
    if (usuario.token != null) {
        if (usuario.expiracion > Date.now()) {
            res.render('formularioReestablecer', {
                nombrePagina: "WorkFlow",
                titulo: "Reestablecer password",
                reestablecer: false,
                error: "Ya se ha enviado un correo a la cuenta"
            });
            return next();
        }
    }
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;
    /*** PRUEBA CON NODEMAILER ***/
    async function main() {
        // let transporter = nodemailer.createTransport({
        //     host: "smtp-mail.outlook.com",
        //     port: 587,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //         user: '84fda2e06df08d:e7e2c6c7dd0613', // generated ethereal user
        //         pass: '', // generated ethereal password
        //     },
        //     tls: {
        //         ciphers: 'SSLv3'
        //     }
        // });
        // Configuracion para el email con MailTrap
        let transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "84fda2e06df08d",
                pass: "e7e2c6c7dd0613"
            }
        });

        // Enviar e-mail
        let info = await transporter.sendMail({
            from: '"Gerardo Flores 👻" <from@example.com>', // Remitente
            to: "to@example.com", // Destinatario(s)
            subject: "Reestablecer password", // Asunto
            text: "Hello world?", // Plain text body
            html: `
                <div style="background-color:#23374d; padding:2rem;margin:0 auto;">
                    <h1 style="color:#8de4af;font-family:'Arial',sans-serif">WorkFlow</h1>
                    <p style="color:#fbfbfb;font-family:'Arial',sans-serif">Hola. Recientemente recibimos un informe de que le debes a Hacienda. Ya paga cabrón.</p>
                    <a style="color:#fbfbfb;font-family:'Arial',sans-serif" href="#" target="_blank">${resetUrl}</a>
                    <br>
                    <br>
                    <b style="color:#fbfbfb;font-family:'Arial',sans-serif">Si tu no solicitaste el reestablecimiento de la contraseña, ignora este mensaje.</b>
                </div>
            `, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
    }

    main().catch(console.error);
    res.render('login', {
        nombrePagina: 'WorkFlow',
        fondo: 'login.gif',
        loading: false,
        mensaje: "Te hemos enviado un correo. Revisa tu bandeja de entrada :)"
    });
}

exports.reestablecerPassword = async(req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
    if (!usuario) {
        // Que vuelva a enviar correo
        res.render('formularioReestablecer', {
            nombrePagina: "WorkFlow",
            titulo: "Reestablecer password",
            reestablecer: false,
            error: "El correo para la activación expiró. Por favor, solicite uno nuevo."
        });
        return next();
    }
    // Cambiar password
    req.checkBody('password').equals(req.body.confirmarpassword).withMessage("Los passwords no coinciden");
    req.checkBody('password').trim().notEmpty().withMessage("El password es obligatorio.");
    req.checkBody('confirmarpassword').trim().notEmpty().withMessage("Confirmar el password es obligatorio.");
    req.sanitizeBody('password').escape();
    const errores = req.validationErrors();
    if (errores) {
        res.render('formularioReestablecer', {
            nombrePagina: "WorkFlow",
            titulo: "Reestablecer password",
            reestablecer: true,
            formAction: `/reestablecer-password/${req.params.token}`,
            errores
        });
        return next();
    }
    let password = req.body.password;
    usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    usuario.save();
    // Redireccionar a inicio
    res.redirect('/');
}

exports.validarCuenta = async(req, res, next) => {
    console.log(req.body);
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
            console.log("ES EDITAR");
            console.log(errores);
            console.log(req.body.imagen);
            const usuario = await Usuarios.findOne({ where: { id_usuario: res.locals.usuario.id_usuario } });
            console.log(usuario.imagen);
            res.render('formularioRegistro', {
                nombrePagina: "WorkFlow - Editar cuenta",
                titulo: "Editar cuenta",
                actionForm: "/mi-cuenta/editar",
                editar: true,
                usuario,
                errores
            });
            // Eliminar la imagen que se guardo
            const rutaImagen = __dirname + `/../public/uploads/${req.body.imagen}`;
            console.log(rutaImagen);
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
            console.log("ES REGISTRAR");
            console.log(errores);
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
    console.log(req.body);
    // SANITIZAR CAMPOS
    req.sanitizeBody('nombre_usuario').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    console.log(req.body);
    return next();
}

// Validacion de la imagen con multer
exports.validarImagen = (req, res, next) => {
    upload(req, res, function(error) {
        // Esta funcion corre despues de toda la validacion con la configuracion de multer.
        console.log(req.file);
        if (error instanceof multer.MulterError) {
            return next();
        }
        next(); // Con next enviamos el archivo y el request con nuestra propiedad nombreImagen
    });
}

// Opciones de Multer
const configMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            console.log("Aquí empieza todo");
            console.log(file);
            console.log(__dirname + '../public/uploads');
            cb(null, __dirname + '/../public/uploads');
        },
        filename: (req, file, cb) => {
            console.log(file);
            const extension = file.mimetype.split('/')[1]; // Capturamos la extension de la imagen
            // Pusheamos esta propiedad en el request para acceder facilmente a ella en el siguiente middleware
            req.body.imagen = `${uuid()}.${extension}`;
            cb(null, req.body.imagen); // Mandamos el nombre de la imagen mediante un callback
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
}

const upload = multer(configMulter).single('imagen');