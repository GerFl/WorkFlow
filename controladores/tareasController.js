// Llama los modelos
const Proyectos = require('../modelos/Proyectos');
const Tareas = require('../modelos/Tareas');

exports.formularioTarea = async(req, res) => {
    // Con esto obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    const tareas = await Tareas.findAll({
        where: {
            proyectoIdProyecto: proyecto.id_proyecto
        }
    });
    res.render('agregarTarea', {
        nombrePagina: 'WorkFlow - Agregar tarea',
        proyecto,
        tareas
    });
}

exports.agregarTarea = async(req, res) => {
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });

    const tarea_nombre = req.body.tareanombre;
    const descripcion_tarea = req.body.descripciontarea;
    const departamento = req.body.departamento;
    const prioridad = req.body.prioridad;
    const estatus = 0;
    const proyectoIdProyecto = proyecto.id_proyecto;

    await Tareas.create({ tarea_nombre, descripcion_tarea, departamento, prioridad, estatus, proyectoIdProyecto });
    res.redirect(`/proyecto/${proyecto.url}`);
}

exports.completarTarea = async(req, res) => {
    /* Se filtra de una manera sencilla, insertando el id en un data dentro de la etiqueta en PUG. Luego de esto lo mandamos con una petición con axios en el script
    principal. Eso hace que se envie al backend y llega aqui a esta funcion. Lo extramos del req.params y hacemos una consulta teniendo ese valor de
    id_tarea como referencia, una vez encontrado cambiamos el estado por el lado del backend y en el frontend hacemos un toggle sin necesidad de
    recargar la pagina. Sencillo, no?
    */
    // GUARDAR EL ESTATUS DE LA TAREA //
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id_tarea: id } });

    // Buscar toooodas las tareas
    // Cambiar el estado de la tarea
    if (tarea.estatus === 0) {
        tarea.estatus = 1;
    }
    // Tareas.patch({ where: { id_tarea: id } });
    // Al hacer la petición con axios a esta parte nos retorna la respuesta de abajo

    const guardarTarea = await tarea.save();
    if (!guardarTarea) return next();

    // GUARDAR EL PORCENTAJE DEL PROYECTO //
    const proyecto = await Proyectos.findOne({ where: { id_proyecto: tarea.proyectoIdProyecto } });

    const tareasCompletadas = await Tareas.findAll({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
            estatus: 1
        }
    });

    const totalTareas = await Tareas.findAll({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
        }
    });

    proyecto.porcentaje = ((tareasCompletadas.length / totalTareas.length).toFixed(2)) * 100;
    const guardarProyecto = await proyecto.save();
    if (!guardarProyecto) return next();
    res.send("Completando la tarea...");
}

exports.descompletarTarea = async(req, res) => {
    // GUARDAR EL ESTADO DE LA TAREA //
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id_tarea: id } });
    // Cambiar el estado de la tarea
    if (tarea.estatus === 1) {
        tarea.estatus = 0;
    }
    // Tareas.patch({ where: { id_tarea: id } });
    // Al hacer la petición con axios a esta parte nos retorna la respuesta de abajo
    const guardarTarea = await tarea.save();
    if (!guardarTarea) return next();

    /* GUARDAR EL PORCENTAJE DEL PROYECTO */
    const proyecto = await Proyectos.findOne({ where: { id_proyecto: tarea.proyectoIdProyecto } });
    const tareasCompletadas = await Tareas.findAll({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
            estatus: 1
        }
    });

    const totalTareas = await Tareas.findAll({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
        }
    });
    proyecto.porcentaje = ((tareasCompletadas.length / totalTareas.length).toFixed(2)) * 100;
    const guardarProyecto = await proyecto.save();

    if (!guardarProyecto) return next();

    res.send("Descompletando la tarea...");
}

exports.eliminarTarea = async(req, res, next) => {
    /* ELIMINAR LA TAREA */
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id_tarea: id } }); // Buscar toooodas las tareas
    const resultado = await Tareas.destroy({ where: { id_tarea: id } });
    if (!resultado) return next();

    /* GUARDAR EL PORCENTAJE DEL PROYECTO */
    const proyecto = await Proyectos.findOne({ where: { id_proyecto: tarea.proyectoIdProyecto } });

    const tareasCompletadas = await Tareas.findAll({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
            estatus: 1
        }
    });

    const totalTareas = await Tareas.findAll({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
        }
    });

    if (totalTareas.length == 0) {
        proyecto.porcentaje = 0;
    } else {
        proyecto.porcentaje = ((tareasCompletadas.length / totalTareas.length).toFixed(2)) * 100;
    }

    const guardarProyecto = await proyecto.save();

    if (!guardarProyecto) return next();

    res.send("Eliminando la tarea...");
}