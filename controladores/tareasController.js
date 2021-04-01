// Llama los modelos
const Proyectos = require('../modelos/Proyectos');
const Tareas = require('../modelos/Tareas');

exports.formularioTarea = async(req, res) => {
    console.log(req.params);
    // Con esto obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    res.render('agregarTarea', {
        nombrePagina: 'WorkFlow - Agregar tarea',
        proyecto
    });
}
exports.agregarTarea = async(req, res) => {
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    // Enviar a la consola lo que el usuario escriba
    console.log("Hello");
    console.log(req.params.proyectourl);
    console.log(req.body);
    console.log(proyecto);
    console.log(proyecto.id_proyecto);

    const tarea_nombre = req.body.tareanombre;
    const descripcion_tarea = req.body.descripciontarea;
    const departamento = req.body.departamento;
    const prioridad = req.body.prioridad;
    const estatus = 0;
    const proyectoIdProyecto = proyecto.id_proyecto;

    await Tareas.create({ tarea_nombre, descripcion_tarea, departamento, prioridad, estatus, proyectoIdProyecto });
    res.redirect(`/proyecto/${proyecto.url}`);
}

exports.eliminarTarea = async(req, res) => {

}