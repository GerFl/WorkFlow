// Express Router. Si no pones esto entonces las rutas no funcionan
// Importa
const express = require('express'); // Se trae todas las funciones de express a este archivo
const router = express.Router();
const Proyectos = require('../modelos/Proyectos');

// Importar los controladores
const proyectosController = require('../controladores/proyectosController');
const tareasController = require('../controladores/tareasController');

module.exports = function() { // Para exportar todas las rutas al archivo de index.js

    // TO-DO
    // Eliminar proyectos

    // Ruta para el HOME
    // No podemos usar app como en el index.js porque no se puede crear
    // otra instancia de Express. Por eso se crea router arriba
    // Usamos .get en vez de .use, porque trae información...creo
    const proyectos = Proyectos.findAll();
    router.get('/', proyectosController.proyectosHome); // Middleware de express
    // LISTAR PROYECTOS
    // Usa proyectourl como comodin, puesto que no sabemos a cuál url va ir. Dicha url se asigna en la vista del index en cada etiqueta a generada por los proyectos listados
    router.get('/proyecto/:proyectourl', proyectosController.proyectoUrl);
    // PROYECTOS - Cada uno reacciona a un método diferente
    router.get('/agregarProyecto', proyectosController.formularioProyecto);
    router.post('/agregarProyecto', proyectosController.agregarProyecto);
    // TAREAS
    router.get('/proyecto/:proyectourl/agregarTarea', tareasController.formularioTarea);
    router.post('/proyecto/:proyectourl/agregarTarea', tareasController.agregarTarea);


    return router;
}