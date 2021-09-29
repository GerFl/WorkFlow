const Usuarios = require('../models/Usuarios');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.loginPage = (req, res) => {
    res.render('login', {
        nombrePagina: 'WorkFlow',
        fondo: 'login.gif',
        loading: false
    });
}

// Reestablecer password
exports.formularioReestablecerPassword = (req, res, next) => {
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
            formAction: "/reestablecer-password"
        });
    }
}

// Esta función usa passport para dar acceso
exports.verificarUsuario = (req, res, next) => passport.authenticate('local', function(err, user, info) {
    (err) ? console.log(err): '';
    if (!user) {
        // Failure message
        res.render('login', {
            nombrePagina: 'WorkFlow',
            fondo: 'failedLogin.gif',
            failedLogin: true
        });
        return res.status(404);
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
        if (req.originalUrl === '/mi-cuenta/eliminar') return next();
        return res.render('login', {
            nombrePagina: "WorkFlow",
            fondo: 'login.gif',
            loading: true
        });
    });
})(req, res, next);

/* La diferencia entre estos middlewares es que con autenticarUsuario 
    verificamos si la persona tiene acceso a las paginas principales y
    continuar la cadena de middlewares. Y con usuarioVerificado sabemos
    que el usuario ya está autenticado pero esta no permite entrar en las
    paginas de reestablecimiento de password.
*/
exports.autenticarUsuario = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // No autenticado
    return res.redirect('/iniciar-sesion');
}
exports.usuarioVerificado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return next();
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

exports.activarCuenta = async(req, res, next) => {
    const usuario = await Usuarios.findOne({ where: { token: req.params.token } });
    if (!usuario) {
        // Failure message
        res.render('login', {
            nombrePagina: 'WorkFlow',
            fondo: 'failedLogin.gif',
            failedLogin: true
        });
        return next();
    }
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

exports.activarToken = async(req, res, next) => {
    const usuario = await Usuarios.findOne({ where: { email: req.body.email } });
    // Si el usuario no existe
    if (!usuario) {
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
    res.redirect('/');
}