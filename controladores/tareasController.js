// Llama los modelos
const Proyectos = require('../modelos/Proyectos');
const Tareas = require('../modelos/Tareas');

exports.formularioTarea = async(req, res) => {
    res.render('agregarTarea', {
        nombrePagina: 'WorkFlow - Agregar tarea'
    });
}
exports.agregarTarea = async(req, res) => {
    // Enviar a la consola lo que el usuario escriba
    console.log(req.body);
}

exports.eliminarTarea = async(req, res) => {

}