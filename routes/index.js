// Express Router. Si no pones esto entonces las rutas no funcionan
const express = require('express'); // Se trae todas las funciones de express a este archivo
const router = express.Router();

const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const authorizationController = require('../controllers/authorizationController');
const usersController = require('../controllers/usersController');

module.exports = function() { // Exportar rutas
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
    // Usa proyectourl como comodin, puesto que no sabemos a cuál url va ir. Dicha url se asigna en la vista del index en cada etiqueta a generada por los proyectos listados
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

    /* AGREGAR Y EDITAR TAREAS */
    router.get('/proyecto/:proyectourl/agregar-tarea',
        authorizationController.usuarioAutenticado,
        tareasController.formularioTarea
    );
    router.post('/proyecto/:proyectourl/agregar-tarea',
        authorizationController.usuarioAutenticado,
        tareasController.validarTareas,
        tareasController.agregarTarea,
        proyectosController.actualizarProyecto
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
        proyectosController.actualizarProyecto
    );
    router.patch('/tarea-descompletada/:id',
        authorizationController.usuarioAutenticado,
        tareasController.descompletarTarea,
        proyectosController.actualizarProyecto
    );
    router.delete('/tarea-eliminar/:id',
        authorizationController.usuarioAutenticado,
        tareasController.eliminarTarea,
        proyectosController.actualizarProyecto
    );

    // ERROR 404
    router.get('*',function(req,res){
        res.status(404).send("¿Qué?");
    });

    return router;
}