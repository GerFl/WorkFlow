// Improtar modelos
const Proyectos = require('../modelos/Proyectos');
const Tareas = require('../modelos/Tareas');
const slug = require('slug');
const shortid = require('shortid');

/* PROYECTOS */
// HOME
exports.paginaPrincipal = async(req, res) => {
    const usuarioId = res.locals.usuario.id_usuario;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioIdUsuario: usuarioId
        }
    });
    res.render('index', {
        nombrePagina: 'WorkFlow',
        proyectos
    });
}

// Listar proyecto
exports.proyectoUrl = async(req, res, next) => {
    // Consultar los proyectos para que nos retorne el que queremos
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    if (!proyecto) return next();
    // PROYECTO EXISTE
    // Se pasa como parametro el id del proyecto. Se accede a el gracias a que hicimos la consulta para traer ese proyecto
    const tareas = await Tareas.findAll({
        where: {
            proyectoIdProyecto: proyecto.id_proyecto
        }
    });
    const areas = proyecto.areas.split(',');
    // Render a la vista UPDATE: AJAJJAJAA no lo habia leido bien
    res.render('proyecto', {
        nombrePagina: `Tareas del proyecto: ${proyecto.nombre_proyecto}`,
        proyecto,
        tareas,
        areas
    });
}

// Vista formulario para agregar
exports.formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id_usuario;
    const totalProyectos = await Proyectos.count({ where: { usuarioIdUsuario: usuarioId } });
    const proyectosCompletados = await Proyectos.count({ where: { usuarioIdUsuario: usuarioId, porcentaje: 100 } });
    res.render('formulariosProyecto', {
        nombrePagina: 'WorkFlow - Agregar proyecto',
        titulo: "Agregar proyecto",
        actionForm: "/agregar-proyecto",
        totalProyectos,
        proyectosCompletados
    });
}

// Vista formulario para editar
exports.formularioEditarProyecto = async(req, res, next) => {
    const usuarioId = res.locals.usuario.id_usuario;
    const totalProyectos = await Proyectos.count({ where: { usuarioIdUsuario: usuarioId } });
    const proyectosCompletados = await Proyectos.count({ where: { usuarioIdUsuario: usuarioId, porcentaje: 100 } });
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    const areas = proyecto.areas.split(',');
    res.render('formulariosProyecto', {
        nombrePagina: `WorkFlow - Editar proyecto: ${proyecto.nombre_proyecto}`,
        titulo: `Editar proyecto:${proyecto.nombre_proyecto}`,
        actionForm: `/proyecto/${proyecto.url}/editar-proyecto`,
        proyecto,
        areas,
        totalProyectos,
        proyectosCompletados
    });
}

// Agregar proyecto
exports.agregarProyecto = async(req, res) => {
    const { nombre_proyecto, descripcion_proyecto, fecha_entrega, areas, color } = req.body;
    const porcentaje = 0;
    const completado = 0;
    const usuarioIdUsuario = res.locals.usuario.id_usuario;

    await Proyectos.create({ nombre_proyecto, descripcion_proyecto, fecha_entrega, porcentaje, areas, color, completado, usuarioIdUsuario })
    return res.redirect('/');
}

exports.editarProyecto = async(req, res) => {
    const proyecto = await Proyectos.findOne({ where: { url: req.params.proyectourl } });
    const { nombre_proyecto, descripcion_proyecto, fecha_entrega, areas, color } = req.body;
    if (proyecto.nombre_proyecto === nombre_proyecto) {
        var url = req.params.proyectourl
    } else {
        const slugurl = slug(nombre_proyecto);
        var url = `${slugurl}-${shortid.generate()}`;
    }
    const proyectoActualizado = await Proyectos.update({
        nombre_proyecto,
        descripcion_proyecto,
        fecha_entrega,
        areas,
        color,
        url
    }, {
        where: {
            id_proyecto: proyecto.id_proyecto,
            usuarioIdUsuario: res.locals.usuario.id_usuario
        }
    });
    if (proyectoActualizado) {
        return res.redirect(`/proyecto/${url}`);
    }
}

exports.eliminarProyecto = async(req, res, next) => {
    const { url } = req.params;
    const proyecto = await Proyectos.destroy({ where: { url } });
    if (!proyecto) return next();
    res.send().status(200);
}

exports.validarProyecto = async(req, res, next) => {
    // VALIDAR ESPACIOS VACIOS
    req.checkBody('nombre_proyecto').trim().notEmpty().withMessage("Debe especificar un nombre para el proyecto.");
    req.checkBody('descripcion_proyecto').trim();
    req.checkBody('fecha_entrega').trim().notEmpty().withMessage("Debe marcar la fecha de entrega.");
    req.checkBody('areas').trim();
    req.checkBody('color').notEmpty().trim().withMessage("Elija un color para identificar el proyecto.");
    // VALIDAR LONGITUD
    req.checkBody('nombre_proyecto', 'El nombre del proyecto debe ser entre 3 y 50 caracteres.').isLength({ min: 3, max: 50 });
    req.checkBody('descripcion_proyecto', 'La descripción del proyecto no debe exceder los 200 caracteres.').isLength({ min: 0, max: 200 });
    // SANITIZAR CAMPOS
    req.sanitizeBody('nombre_proyecto').escape();
    req.sanitizeBody('descripcion_proyecto').escape();
    req.sanitizeBody('fecha_entrega').escape();
    req.sanitizeBody('areas').escape();
    req.sanitizeBody('color').escape();
    const errores = req.validationErrors();
    if (errores) {
        const usuarioId = res.locals.usuario.id_usuario;
        const totalProyectos = await Proyectos.count({ where: { usuarioIdUsuario: usuarioId } });
        const proyectosCompletados = await Proyectos.count({ where: { usuarioIdUsuario: usuarioId, porcentaje: 100 } });
        if (!req.params.proyectourl) { // Al agregar nuevos proyectos
            res.render('formulariosProyecto', {
                nombrePagina: 'WorkFlow - Agregar proyecto',
                titulo: "Agregar proyecto",
                actionForm: "/agregar-proyecto",
                totalProyectos,
                proyectosCompletados,
                errores
            });
            res.status(401);
            return;
        } else { // Al editar el proyecto
            const proyecto = await Proyectos.findOne({
                where: {
                    url: req.params.proyectourl
                }
            });
            const areas = proyecto.areas.split(',');
            res.render('formulariosProyecto', {
                nombrePagina: `WorkFlow - Editar proyecto: ${proyecto.nombre_proyecto}`,
                titulo: `Editar proyecto:${proyecto.nombre_proyecto}`,
                actionForm: `/proyecto/${proyecto.url}/editar-proyecto`,
                proyecto,
                areas,
                totalProyectos,
                proyectosCompletados,
                errores
            });
            res.status(401);
            return;
        }
    }
    return next();
}