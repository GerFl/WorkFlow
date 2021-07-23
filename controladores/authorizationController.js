// Importar
const Usuarios = require('../modelos/Usuarios');
const Proyectos = require('../modelos/Proyectos');
const passport = require('passport');


exports.loginPage = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        res.render('login', {
            nombrePagina: 'WorkFlow',
            fondo: 'login.gif',
            loading: false
        });
    }
}

exports.formRegistro = (req, res) => {
    res.render('registrarse', {
        nombrePagina: "Registrarse en WorkFlow"
    });
}

exports.crearCuenta = async(req, res, next) => {
    // Validar
    req.checkBody('nombre_usuario').trim().notEmpty().withMessage("Debe de indicar un nombre de usuario.");
    req.checkBody('email').trim().notEmpty().isEmail().withMessage("Ingrese un correo válido.");
    req.checkBody('password').trim().notEmpty().withMessage("El password es obligatorio.");
    // Sanitizar
    req.sanitizeBody('nombre_usuario').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    const errores = req.validationErrors();
    if (errores) {
        console.log("HAY ERRORES");
        console.log(errores);
        res.render('registrarse', {
            nombrePagina: "Registrarse en WorkFlow",
            errores
        });
        return next();
    }
    const { nombre_usuario, email, password } = req.body;
    const existe = await Usuarios.findOne({ where: { email } });
    if (existe) {
        const error = "Usuario ya registrado con ese correo";
        res.render('registrarse', {
            nombrePagina: "Registrarse en WorkFlow",
            error
        });
    } else {
        await Usuarios.create({ nombre_usuario, email, password });
        res.redirect('/iniciar-sesion');
    }
}

// exports.autenticacionCorrecta = async(req, res, next) => {
//     const usuarioId = res.locals.usuario.id_usuario;
//     const proyectos = await Proyectos.findAll({
//         where: {
//             usuarioIdUsuario: usuarioId
//         }
//     });
//     const loading = "success200.gif";
//     res.render('index', {
//         nombrePagina: 'WorkFlow',
//         loading,
//         proyectos
//     });
// }

// exports.autenticacionFallida = (req, res) => {
//     res.render('login', {
//         nombrePagina: 'WorkFlow',
//         fondo: 'failedLogin.gif',
//         error: true
//     });
// }

// Verificar los datos del usuario
// exports.verificarUsuario = passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/iniciar-sesion/failure'
// });
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