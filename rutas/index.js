// Express Router. Si no pones esto entonces las rutas no funcionan
// Importa
const express = require('express'); // Se trae todas las funciones de express a este archivo
const router = express.Router();

// Importar los controladores
const proyectosController = require('../controladores/proyectosController');
const tareasController = require('../controladores/tareasController');
const authorizationController = require('../controladores/authorizationController');

module.exports = function() { // Para exportar todas las rutas al archivo de index.js

    // TO-DO
    // Eliminar proyectos

    // HOME
    // No podemos usar app como en el index.js porque no se puede crear
    // otra instancia de Express. Por eso se crea router arriba
    // Usamos .get en vez de .use, porque trae información...creo
    router.get('/',
        authorizationController.usuarioVerificado,
        proyectosController.paginaPrincipal
    ); // Middleware de express

    // LOGIN Y REGISTRO
    router.get('/registrarse', authorizationController.formRegistro);
    router.post('/registrarse', authorizationController.crearCuenta);
    router.get('/iniciar-sesion', authorizationController.loginPage);
    router.post('/iniciar-sesion', authorizationController.verificarUsuario);
    router.get('/cerrar-sesion', authorizationController.cerrarSesion);
    // router.get('/iniciar-sesion/failure', authorizationController.autenticacionFallida);
    // router.get('/iniciar-sesion/success',
    //     authorizationController.usuarioVerificado,
    //     authorizationController.autenticacionCorrecta
    // );

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
        proyectosController.agregarProyecto
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
        tareasController.agregarTarea
    );
    // Actualizar tarea
    router.patch('/tarea-completada/:id',
        authorizationController.usuarioVerificado,
        tareasController.completarTarea
    );
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