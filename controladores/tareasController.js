// Importar modelos
const Proyectos = require('../modelos/Proyectos');
const Tareas = require('../modelos/Tareas');

exports.formularioTarea = async(req, res) => {
    // Con esto obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    // const tareas = await Tareas.findAll({
    //     where: {
    //         proyectoIdProyecto: proyecto.id_proyecto
    //     }
    // });
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

exports.formularioEditarTarea = async(req, res, next) => {
    console.log("El formulario gg");
    // Con esto obtenemos el proyecto actual
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

exports.agregarTarea = async(req, res, next) => {
    // Validar
    req.checkBody('tarea_nombre').trim().notEmpty().withMessage("Indica un nombre para la tarea");
    req.checkBody('descripcion_tarea').trim().notEmpty().withMessage('Debes escribir una descripción');
    req.checkBody('departamento').trim().notEmpty().withMessage("Indica el departamento");
    req.checkBody('prioridad').trim().notEmpty().withMessage("Indica la prioridad");
    // Sanitizar
    req.sanitizeBody('tarea_nombre').escape();
    req.sanitizeBody('descripcion_tarea').escape();
    req.sanitizeBody('departamento').escape();
    req.sanitizeBody('prioridad').escape();
    const errores = req.validationErrors();
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    if (errores) {
        // Con esto obtenemos el proyecto actual
        console.log(req.params);
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
        res.render('formulariosTarea', {
            nombrePagina: 'WorkFlow - Agregar tarea',
            proyecto,
            tareas,
            errores
        });
        return next();
    }

    const { tarea_nombre, descripcion_tarea, departamento, prioridad } = req.body;
    const estatus = 0;
    const proyectoIdProyecto = proyecto.id_proyecto;

    await Tareas.create({ tarea_nombre, descripcion_tarea, departamento, prioridad, estatus, proyectoIdProyecto });
    res.redirect(`/proyecto/${proyecto.url}`);
}

exports.editarTarea = async(req, res, next) => {
    // Validar
    req.checkBody('tarea_nombre').trim().notEmpty().withMessage("Indica un nombre para la tarea");
    req.checkBody('descripcion_tarea').trim().notEmpty().withMessage('Debes escribir una descripción');
    req.checkBody('departamento').trim().notEmpty().withMessage("Indica el departamento");
    req.checkBody('prioridad').trim().notEmpty().withMessage("Indica la prioridad");
    // Sanitizar
    req.sanitizeBody('tarea_nombre').escape();
    req.sanitizeBody('descripcion_tarea').escape();
    req.sanitizeBody('departamento').escape();
    req.sanitizeBody('prioridad').escape();
    const errores = req.validationErrors();
    if (errores) {
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
            totalTareas: await Tareas.count({ where: { proyectoIdProyecto: proyecto.id_proyecto } }),
            tareasCompletadas: await Tareas.count({ where: { proyectoIdProyecto: proyecto.id_proyecto, estatus: 1 } }),
            tarea,
            areas,
            errores
        });
        return next();
    }
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

    if (tarea) {
        res.redirect(`/proyecto/${req.params.proyectourl}`);
    }

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
    const guardarProyecto = await proyecto.save();
    if (!guardarProyecto) return next();
    res.send().status(200);
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
    const guardarProyecto = await proyecto.save();

    if (!guardarProyecto) return next();

    res.send().status(200);
}

exports.eliminarTarea = async(req, res, next) => {
    /* ELIMINAR LA TAREA */
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id_tarea: id } }); // Buscar toooodas las tareas
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

    if (totalTareas == 0) {
        proyecto.porcentaje = 0;
    } else {
        proyecto.porcentaje = ((tareasCompletadas / totalTareas).toFixed(2)) * 100;
    }

    const guardarProyecto = await proyecto.save();

    if (!guardarProyecto) return next();
    res.send().status(200);
}