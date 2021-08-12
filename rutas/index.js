// Express Router. Si no pones esto entonces las rutas no funcionan
// Importa
const express = require('express'); // Se trae todas las funciones de express a este archivo
const router = express.Router();

// Importar los controladores
const proyectosController = require('../controladores/proyectosController');
const tareasController = require('../controladores/tareasController');
const authorizationController = require('../controladores/authorizationController');

module.exports = function() { // Para exportar todas las rutas al archivo de index.js

    // HOME
    // No podemos usar app como en el index.js porque no se puede crear
    // otra instancia de Express. Por eso se crea router arriba
    // Usamos .get en vez de .use, porque trae información...creo
    router.get('/',
        authorizationController.usuarioVerificado,
        proyectosController.paginaPrincipal
    ); // Middleware de express

    // LOGIN Y REGISTRO
    router.get('/iniciar-sesion',
        authorizationController.loginPage
    );
    router.post('/iniciar-sesion', authorizationController.verificarUsuario);
    // Crear cuenta
    router.get('/registrarse',
        authorizationController.formularioRegistro
    );
    router.post('/registrarse',
        authorizationController.validarCuenta,
        authorizationController.crearCuenta
    );
    // Editar cuenta
    router.get('/mi-cuenta/editar',
        authorizationController.usuarioVerificado,
        authorizationController.formularioEditarCuenta
    );
    router.post('/mi-cuenta/editar',
        authorizationController.usuarioVerificado,
        authorizationController.validarImagen,
        authorizationController.validarCuenta,
        authorizationController.editarCuenta
    );
    router.get('/cerrar-sesion', authorizationController.cerrarSesion);
    // Reestablecer password
    router.get('/reestablecer-password',
        authorizationController.formularioReestablecerPassword
    );
    router.post('/reestablecer-password',
        authorizationController.activarToken
    );
    router.get('/reestablecer-password/:token',
        authorizationController.formularioReestablecerPassword
    );
    router.post('/reestablecer-password/:token',
        authorizationController.reestablecerPassword
    );
    // Activar la cuenta
    router.get('/mi-cuenta/activar/:token',
        authorizationController.activarCuenta
    );

    /* PROYECTOS */
    // Listar proyectos
    // Usa proyectourl como comodin, puesto que no sabemos a cuál url va ir. Dicha url se asigna en la vista del index en cada etiqueta a generada por los proyectos listados
    router.get('/proyecto/:proyectourl',
        authorizationController.usuarioVerificado,
        proyectosController.proyectoUrl
    );
    // Agregar proyectos - Cada uno reacciona a un método diferente
    router.get('/agregar-proyecto',
        authorizationController.usuarioVerificado,
        proyectosController.formularioProyecto
    );
    router.post('/agregar-proyecto',
        authorizationController.usuarioVerificado,
        proyectosController.validarProyecto,
        proyectosController.agregarProyecto
    );
    // Editar proyectos
    router.get('/proyecto/:proyectourl/editar-proyecto',
        authorizationController.usuarioVerificado,
        proyectosController.formularioEditarProyecto
    );
    router.post('/proyecto/:proyectourl/editar-proyecto',
        authorizationController.usuarioVerificado,
        proyectosController.validarProyecto,
        proyectosController.editarProyecto
    );
    // Eliminar proyecto
    router.delete('/eliminar-proyecto/:url',
        authorizationController.usuarioVerificado,
        proyectosController.eliminarProyecto
    );

    /* TAREAS */
    // Agregar tareas
    router.get('/proyecto/:proyectourl/agregar-tarea',
        authorizationController.usuarioVerificado,
        tareasController.formularioTarea
    );
    router.post('/proyecto/:proyectourl/agregar-tarea',
        authorizationController.usuarioVerificado,
        tareasController.validarTareas,
        tareasController.agregarTarea
    );
    // Editar tarea
    router.get('/proyecto/:proyectourl/editar-tarea/:idtarea',
        authorizationController.usuarioVerificado,
        tareasController.formularioEditarTarea
    );
    router.post('/proyecto/:proyectourl/editar-tarea/:idtarea',
        authorizationController.usuarioVerificado,
        tareasController.validarTareas,
        tareasController.editarTarea
    );
    // Tarea completada
    router.patch('/tarea-completada/:id',
        authorizationController.usuarioVerificado,
        tareasController.completarTarea
    );
    // Tarea descompletada
    router.patch('/tarea-descompletada/:id',
        authorizationController.usuarioVerificado,
        tareasController.descompletarTarea
    );
    // Eliminar tarea
    router.delete('/tarea-eliminar/:id',
        authorizationController.usuarioVerificado,
        tareasController.eliminarTarea
    );


    return router;
}