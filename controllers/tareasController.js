const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.formularioTarea = async(req, res) => {
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    const areas = proyecto.areas.split(',');
    res.render('formulariosTarea', {
        nombrePagina: `${proyecto.nombre_proyecto}: Agregar tarea`,
        titulo: "Nueva Tarea",
        actionForm: `/proyecto/${proyecto.url}/agregar-tarea`,
        proyecto,
        totalTareas: await Tareas.count({
            where: {
                proyectoIdProyecto: proyecto.id_proyecto
            }
        }),
        tareasCompletadas: await Tareas.count({
            where: {
                proyectoIdProyecto: proyecto.id_proyecto,
                estatus: 1
            }
        }),
        areas
    });
}

exports.formularioEditarTarea = async(req, res) => {
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    const tarea = await Tareas.findOne({
        where: {
            id_tarea: req.params.idtarea
        }
    });
    const areas = proyecto.areas.split(',');
    res.render('formulariosTarea', {
        nombrePagina: `${proyecto.nombre_proyecto}: Editar tarea`,
        titulo: `Editar Tarea: ${tarea.tarea_nombre}`,
        actionForm: `/proyecto/${proyecto.url}/editar-tarea/${tarea.id_tarea}`,
        proyecto,
        totalTareas: await Tareas.count({
            where: {
                proyectoIdProyecto: proyecto.id_proyecto
            }
        }),
        tareasCompletadas: await Tareas.count({
            where: {
                proyectoIdProyecto: proyecto.id_proyecto,
                estatus: 1
            }
        }),
        tarea,
        areas
    });
}

exports.agregarTarea = async(req, res) => {
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    const { tarea_nombre, descripcion_tarea, departamento, prioridad } = req.body;
    const estatus = 0;
    const proyectoIdProyecto = proyecto.id_proyecto;

    await Tareas.create({ tarea_nombre, descripcion_tarea, departamento, prioridad, estatus, proyectoIdProyecto });
    res.redirect(`/proyecto/${proyecto.url}`);
}

exports.editarTarea = async(req, res) => {
    const { id_tarea, tarea_nombre, descripcion_tarea, departamento, prioridad } = req.body;
    const tarea = await Tareas.update({
        tarea_nombre,
        descripcion_tarea,
        departamento,
        prioridad
    }, {
        where: {
            id_tarea
        }
    });
    if (tarea) res.redirect(`/proyecto/${req.params.proyectourl}`);

}

exports.completarTarea = async(req, res) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id_tarea: id } });
    (tarea.estatus === 0) ? tarea.estatus = 1: tarea.estatus = 0;
    const guardarTarea = await tarea.save();
    if (!guardarTarea) return next();
    // GUARDAR EL PORCENTAJE DEL PROYECTO //
    const proyecto = await Proyectos.findOne({ where: { id_proyecto: tarea.proyectoIdProyecto } });
    const tareasCompletadas = await Tareas.count({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
            estatus: 1
        }
    });
    const totalTareas = await Tareas.count({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
        }
    });
    proyecto.porcentaje = ((tareasCompletadas / totalTareas).toFixed(2)) * 100;
    console.log(((tareasCompletadas / totalTareas).toFixed(2)) * 100);
    console.log(proyecto.porcentaje);
    const guardarProyecto = await proyecto.save();
    if (!guardarProyecto) return next();
    res.send().status(200);
}

exports.descompletarTarea = async(req, res) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id_tarea: id } });
    (tarea.estatus === 1) ? tarea.estatus = 0: tarea.estatus === 1;
    const guardarTarea = await tarea.save();
    if (!guardarTarea) return next();
    /* GUARDAR EL PORCENTAJE DEL PROYECTO */
    const proyecto = await Proyectos.findOne({ where: { id_proyecto: tarea.proyectoIdProyecto } });
    const tareasCompletadas = await Tareas.count({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
            estatus: 1
        }
    });
    const totalTareas = await Tareas.count({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
        }
    });
    proyecto.porcentaje = ((tareasCompletadas / totalTareas).toFixed(2)) * 100;
    console.log(((tareasCompletadas / totalTareas).toFixed(2)) * 100);
    console.log(proyecto.porcentaje);
    const guardarProyecto = await proyecto.save();
    if (!guardarProyecto) return next();
    res.send().status(200);
}

exports.eliminarTarea = async(req, res, next) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id_tarea: id } });
    const resultado = await Tareas.destroy({ where: { id_tarea: id } });
    if (!resultado) return next();
    /* GUARDAR EL PORCENTAJE DEL PROYECTO */
    const proyecto = await Proyectos.findOne({ where: { id_proyecto: tarea.proyectoIdProyecto } });
    const tareasCompletadas = await Tareas.count({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
            estatus: 1
        }
    });
    const totalTareas = await Tareas.count({
        where: {
            proyectoIdProyecto: tarea.proyectoIdProyecto,
        }
    });
    (totalTareas == 0) ? proyecto.porcentaje = 0: proyecto.porcentaje = ((tareasCompletadas / totalTareas).toFixed(2)) * 100;
    const guardarProyecto = await proyecto.save();
    if (!guardarProyecto) return next();
    res.send().status(200);
}

exports.validarTareas = async(req, res, next) => {
    // VALIDAR ESPACIOS VACIOS
    req.checkBody('tarea_nombre').trim().notEmpty().withMessage("Indica un nombre para la tarea");
    req.checkBody('descripcion_tarea').trim().notEmpty().withMessage('Debes escribir una descripción');
    req.checkBody('departamento').trim();
    req.checkBody('prioridad').trim().notEmpty().withMessage("Indica la prioridad");
    // VALIDAR LONGITUD
    req.checkBody('tarea_nombre', 'El nombre de la tarea debe ser entre 3 y 30 caracteres.').isLength({ min: 3, max: 30 });
    req.checkBody('descripcion_tarea', 'La descripción de la tarea debe ser entre 2 y 100 caracteres.').isLength({ min: 2, max: 100 });
    const errores = req.validationErrors();
    if (errores) {
        const proyecto = await Proyectos.findOne({
            where: { url: req.params.proyectourl }
        });
        const totalTareas = await Tareas.count({
            where: { proyectoIdProyecto: proyecto.id_proyecto }
        });
        const tareasCompletadas = await Tareas.count({
            where: { proyectoIdProyecto: proyecto.id_proyecto, estatus: 1 }
        });
        const areas = proyecto.areas.split(',');

        if (!req.params.idtarea) { // AL AGREGAR
            res.render('formulariosTarea', {
                nombrePagina: `${proyecto.nombre_proyecto}: Agregar tarea`,
                titulo: "Nueva Tarea",
                actionForm: `/proyecto/${proyecto.url}/agregar-tarea`,
                proyecto,
                totalTareas,
                tareasCompletadas,
                areas,
                errores
            });
            res.status(401);
            return;
        } else if (req.params.idtarea) { // AL EDITAR
            const tarea = await Tareas.findOne({
                where: {
                    id_tarea: req.params.idtarea
                }
            });
            res.render('formulariosTarea', {
                nombrePagina: `${proyecto.nombre_proyecto}: Editar tarea`,
                titulo: `Editar Tarea: ${tarea.tarea_nombre}`,
                actionForm: `/proyecto/${proyecto.url}/editar-tarea/${tarea.id_tarea}`,
                proyecto,
                totalTareas,
                tareasCompletadas,
                tarea,
                areas,
                errores
            });
            res.status(401);
            return;
        }
    } else {
        // SANITIZAR CAMPOS
        req.sanitizeBody('tarea_nombre').escape();
        req.sanitizeBody('descripcion_tarea').escape();
        req.sanitizeBody('departamento').escape();
        req.sanitizeBody('prioridad').escape();
        return next();
    }
}