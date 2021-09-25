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
        authorizationController.usuarioAutenticado,
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
        authorizationController.usuarioAutenticado,
        usersController.formularioEditarCuenta
    );
    router.post('/mi-cuenta/editar',
        authorizationController.usuarioAutenticado,
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
    router.get('/cerrar-sesion', authorizationController.cerrarSesion);

    /* PROYECTOS */
    // Listar proyectos
    // Usa proyectourl como comodin, puesto que no sabemos a cuál url va ir.
    // Dicha url se asigna en la vista del index en cada etiqueta a generada por los proyectos listados
    router.get('/proyecto/:proyectourl',
        authorizationController.usuarioAutenticado,
        proyectosController.proyectoUrl
    );
    /* AGREGAR Y EDITAR PROYECTOS */
    router.get('/agregar-proyecto',
        authorizationController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );
    router.post('/agregar-proyecto',
        authorizationController.usuarioAutenticado,
        proyectosController.validarProyecto,
        proyectosController.agregarProyecto
    );
    router.get('/proyecto/:proyectourl/editar-proyecto',
        authorizationController.usuarioAutenticado,
        proyectosController.formularioEditarProyecto
    );
    router.post('/proyecto/:proyectourl/editar-proyecto',
        authorizationController.usuarioAutenticado,
        proyectosController.validarProyecto,
        proyectosController.editarProyecto
    );
    // ELIMINAR PROYECTOS
    router.delete('/eliminar-proyecto/:url',
        authorizationController.usuarioAutenticado,
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
        authorizationController.usuarioAutenticado,
        tareasController.formularioTarea
    );
    router.post('/proyecto/:proyectourl/agregar-tarea',
        authorizationController.usuarioAutenticado,
        tareasController.validarTareas,
        tareasController.agregarTarea,
        proyectosController.actualizarPorcentaje
    );
    router.get('/proyecto/:proyectourl/editar-tarea/:idtarea',
        authorizationController.usuarioAutenticado,
        tareasController.formularioEditarTarea
    );
    router.post('/proyecto/:proyectourl/editar-tarea/:idtarea',
        authorizationController.usuarioAutenticado,
        tareasController.validarTareas,
        tareasController.editarTarea
    );
    /* COMPLETAR, DESCOMPLETAR Y ELIMINAR TAREAS */
    router.patch('/tarea-completada/:id',
        authorizationController.usuarioAutenticado,
        tareasController.completarTarea,
        proyectosController.actualizarPorcentaje
    );
    router.patch('/tarea-descompletada/:id',
        authorizationController.usuarioAutenticado,
        tareasController.descompletarTarea,
        proyectosController.actualizarPorcentaje
    );
    router.delete('/tarea-eliminar/:id',
        authorizationController.usuarioAutenticado,
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