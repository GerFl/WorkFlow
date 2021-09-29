// Express Router. Si no pones esto entonces las rutas no funcionan
const express = require('express'); // Se trae todas las funciones de express a este archivo
const router = express.Router();

const usersController = require('../controllers/usersController');
const authorizationController = require('../controllers/authorizationController');
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const proyectosCompartidos = require('../controllers/proysCompartidosController');

module.exports = function() { // Exportar rutas
    /* HOME */
    router.get('/',
        authorizationController.autenticarUsuario,
        proyectosController.paginaPrincipal
    );
    /* LOGIN Y REGISTRO */
    router.get('/iniciar-sesion',
        authorizationController.usuarioVerificado,
        authorizationController.loginPage
    );
    router.post('/iniciar-sesion',
        authorizationController.usuarioVerificado,
        authorizationController.verificarUsuario
    );
    router.get('/registrarse',
        authorizationController.usuarioVerificado,
        usersController.formularioRegistro
    );
    router.post('/registrarse',
        authorizationController.usuarioVerificado,
        usersController.validarCuenta,
        usersController.crearCuenta
    );
    /* EDICION DE LA CUENTA Y REESTABLECIMIENTO DE PASSWORD */
    router.get('/mi-cuenta/editar',
        authorizationController.autenticarUsuario,
        usersController.formularioEditarCuenta
    );
    router.post('/mi-cuenta/editar',
        authorizationController.autenticarUsuario,
        usersController.validarImagen,
        usersController.validarCuenta,
        usersController.editarCuenta
    );
    router.get('/reestablecer-password',
        authorizationController.usuarioVerificado,
        authorizationController.formularioReestablecerPassword
    );
    router.post('/reestablecer-password',
        authorizationController.usuarioVerificado,
        authorizationController.activarToken
    );
    router.get('/reestablecer-password/:token',
        authorizationController.usuarioVerificado,
        authorizationController.formularioReestablecerPassword
    );
    router.post('/reestablecer-password/:token',
        authorizationController.usuarioVerificado,
        authorizationController.reestablecerPassword
    );
    router.get('/mi-cuenta/activar/:token',
        authorizationController.usuarioVerificado,
        authorizationController.activarCuenta
    );
    /* CERRAR SESION Y ELIMINACION DE LA CUENTA */
    router.get('/mi-cuenta/eliminar',
        authorizationController.autenticarUsuario,
        usersController.formularioEliminarCuenta
    );
    router.post('/mi-cuenta/eliminar',
        authorizationController.autenticarUsuario,
        usersController.eliminarCuenta
    );
    router.get('/cerrar-sesion',
        authorizationController.cerrarSesion
    );
    /* PROYECTOS */
    // Listar proyectos
    // Usa proyectourl como comodin, puesto que no sabemos a cuál url va ir.
    // Dicha url se asigna en la vista del index en cada etiqueta a generada por los proyectos listados
    router.get('/proyecto/:proyectourl',
        authorizationController.autenticarUsuario,
        proyectosController.proyectoUrl
    );
    /* AGREGAR Y EDITAR PROYECTOS */
    router.get('/agregar-proyecto',
        authorizationController.autenticarUsuario,
        proyectosController.formularioProyecto
    );
    router.post('/agregar-proyecto',
        authorizationController.autenticarUsuario,
        proyectosController.validarProyecto,
        proyectosController.agregarProyecto,
        proyectosCompartidos.agregarRelaciones
    );
    router.get('/proyecto/:proyectourl/editar-proyecto',
        authorizationController.autenticarUsuario,
        proyectosController.formularioEditarProyecto
    );
    router.post('/proyecto/:proyectourl/editar-proyecto',
        authorizationController.autenticarUsuario,
        proyectosController.validarProyecto,
        proyectosController.editarProyecto,
        proyectosCompartidos.borrarRelaciones,
        proyectosCompartidos.agregarRelaciones
    );
    // ELIMINAR PROYECTOS
    router.delete('/eliminar-proyecto/:url',
        authorizationController.autenticarUsuario,
        proyectosController.eliminarProyecto
    );
    /* FIN PROYECTOS */

    /* PROYECTOS COMPARTIDOS */
    router.get('/usuarios',
        proyectosCompartidos.buscarUsuario
    );
    /* FIN PROYECTOS COMPARTIDOS */

    /* TAREAS */
    /* AGREGAR Y EDITAR TAREAS */
    router.get('/proyecto/:proyectourl/agregar-tarea',
        authorizationController.autenticarUsuario,
        tareasController.formularioTarea
    );
    router.post('/proyecto/:proyectourl/agregar-tarea',
        authorizationController.autenticarUsuario,
        tareasController.validarTareas,
        tareasController.agregarTarea,
        proyectosController.actualizarPorcentaje
    );
    router.get('/proyecto/:proyectourl/editar-tarea/:idtarea',
        authorizationController.autenticarUsuario,
        tareasController.formularioEditarTarea
    );
    router.post('/proyecto/:proyectourl/editar-tarea/:idtarea',
        authorizationController.autenticarUsuario,
        tareasController.validarTareas,
        tareasController.editarTarea
    );
    /* COMPLETAR, DESCOMPLETAR Y ELIMINAR TAREAS */
    router.patch('/tarea-completada/:id',
        authorizationController.autenticarUsuario,
        tareasController.completarTarea,
        proyectosController.actualizarPorcentaje
    );
    router.patch('/tarea-descompletada/:id',
        authorizationController.autenticarUsuario,
        tareasController.descompletarTarea,
        proyectosController.actualizarPorcentaje
    );
    router.delete('/tarea-eliminar/:id',
        authorizationController.autenticarUsuario,
        tareasController.eliminarTarea,
        proyectosController.actualizarPorcentaje
    );

    // ERROR 404
    router.get('*', function(req, res) {
        res.render('404', {
            nombrePagina: "WorkFlow"
        });
    });

    return router;
}