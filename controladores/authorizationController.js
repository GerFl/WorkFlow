const Usuarios = require('../modelos/Usuarios');
const Proyectos = require('../modelos/Proyectos');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');


exports.loginPage = (req, res) => {
    const colorCandado = "#ffffff";
    res.render('login', {
        nombrePagina: 'WorkFlow',
        fondo: 'login.gif',
        colorCandado
    });
    // background-image:url('../login.gif');
}

exports.formRegistro = (req, res) => {
    res.render('registrarse', {
        nombrePagina: "Registrarse en WorkFlow"
    });
}

exports.crearCuenta = async(req, res, next) => {
    console.log(req.body);
    const { nombre_usuario, email, password } = req.body;

    await Usuarios.create({
        nombre_usuario,
        email,
        password
    });
    res.redirect('/iniciar-sesion');
}

exports.verificarUsuario = async(req, res, next) => {
    console.log("HELLO");
    console.log(req.body);
    const usuario = await Usuarios.findOne({ where: { email: req.body.email } });
    console.log(usuario);
    if (!usuario) {
        const error = "ERROR";
        const colorCandado = "#d93b5b";
        res.render('login', {
            nombrePagina: 'WorkFlow',
            fondo: 'failedLogin.gif',
            error,
            colorCandado
        });
    }

    const proyectos = await Proyectos.findAll();
    const loading = "success200.gif";
    res.render('index', {
        nombrePagina: 'WorkFlow',
        proyectos,
        loading
    });
    // res.send("La vdd no se que esta pasando");
}