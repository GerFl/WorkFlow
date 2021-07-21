// Importar
const Usuarios = require('../modelos/Usuarios');
const Proyectos = require('../modelos/Proyectos');
const passport = require('passport');


exports.loginPage = (req, res) => {
    const colorCandado = "#ffffff";
    res.render('login', {
        nombrePagina: 'WorkFlow',
        fondo: 'login.gif',
        colorCandado
    });
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

exports.autenticacionFallida = (req, res, next) => {
    const error = "ERROR";
    const colorCandado = "#d93b5b";
    res.render('login', {
        nombrePagina: 'WorkFlow',
        fondo: 'failedLogin.gif',
        error,
        colorCandado
    });
}

exports.autenticacionCorrecta = async(req, res, next) => {
    const usuarioId = res.locals.usuario.id_usuario;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioIdUsuario: usuarioId
        }
    });
    const loading = "success200.gif";
    res.render('index', {
        nombrePagina: 'WorkFlow',
        loading,
        proyectos
    });
}

// Verificar los datos del usuario
exports.verificarUsuario = passport.authenticate('local', {
    successRedirect: '/iniciar-sesion/success',
    failureRedirect: '/iniciar-sesion/failure'
});
// Verificar que haya sido autenticado para acceder a las paginas
exports.usurioVerificado = (req, res, next) => {
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