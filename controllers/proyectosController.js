const slug = require('slug');
const shortid = require('shortid');
const Usuarios = require('../models/Usuarios');
const Proyectos = require('../models/Proyectos');
const ProyectosCompartidos = require('../models/ProyectosCompartidos');
const Tareas = require('../models/Tareas');

exports.paginaPrincipal = async(req, res) => {
    const usuario = await Usuarios.findOne({ where: { id_usuario: res.locals.usuario.id_usuario } })
    const relaciones = await ProyectosCompartidos.findAll({
        where: {
            usuarioIdUsuario: usuario.id_usuario
        },
        attributes: ['proyectoIdProyecto']
    });
    console.log(relaciones);
    let proyectos = [];
    for (let i = 0; i < relaciones.length; i++) {
        let proyecto = await Proyectos.findOne({
            where: {
                id_proyecto: relaciones[i].proyectoIdProyecto
            }
        });
        proyectos.push(proyecto);
    }
    res.render('index', {
        nombrePagina: 'WorkFlow',
        proyectos,
        usuario
    });
}

// Listar proyecto
exports.proyectoUrl = async(req, res, next) => {
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    if (!proyecto) return next();
    // SI PROYECTO EXISTE
    const tareas = await Tareas.findAll({
        where: {
            proyectoIdProyecto: proyecto.id_proyecto
        }
    });
    const areas = proyecto.areas.split(',');
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
    const usuario = await Usuarios.findOne({ where: { id_usuario: usuarioId } });
    // const totalProyectos = await Proyectos.count({ where: { usuarioIdUsuario: usuarioId } });
    // const proyectosCompletados = await Proyectos.count({ where: { usuarioIdUsuario: usuarioId, porcentaje: 100 } });
    res.render('formulariosProyecto', {
        nombrePagina: 'WorkFlow - Agregar proyecto',
        titulo: "Agregar proyecto",
        actionForm: "/agregar-proyecto",
        // totalProyectos,
        // proyectosCompletados,
        usuario
    });
}

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
    const totalTareas = await Tareas.count({ where: { proyectoIdProyecto: proyecto.id_proyecto } });
    const tareasCompletadas = await Tareas.count({ where: { proyectoIdProyecto: proyecto.id_proyecto, estatus: 1 } });
    res.render('formulariosProyecto', {
        nombrePagina: `WorkFlow - Editar proyecto: ${proyecto.nombre_proyecto}`,
        titulo: `Editar proyecto:${proyecto.nombre_proyecto}`,
        actionForm: `/proyecto/${proyecto.url}/editar-proyecto`,
        proyecto,
        totalProyectos,
        proyectosCompletados,
        areas,
        totalTareas,
        tareasCompletadas
    });
}

exports.agregarProyecto = async(req, res) => {
    const { nombre_proyecto, descripcion_proyecto, fecha_entrega, areas, color } = req.body;
    const porcentaje = 0;
    const completado = 0;
    const usuarioIdUsuario = res.locals.usuario.id_usuario;
    const proyecto = await Proyectos.create({
        nombre_proyecto,
        descripcion_proyecto,
        fecha_entrega,
        porcentaje,
        areas,
        color,
        completado,
        usuarioIdUsuario
    });
    const relacion = await ProyectosCompartidos.create({
        proyectoIdProyecto: proyecto.id_proyecto,
        usuarioIdUsuario: res.locals.usuario.id_usuario
    });
    if (relacion) return res.redirect('/');
}

exports.editarProyecto = async(req, res) => {
    var url = req.params.proyectourl
    const proyecto = await Proyectos.findOne({ where: { url } });
    const { nombre_proyecto, descripcion_proyecto, fecha_entrega, areas, color } = req.body;
    if (proyecto.nombre_proyecto != nombre_proyecto) {
        var url = `${slug(nombre_proyecto)}-${shortid.generate()}`;
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

exports.actualizarProyecto = async(req, res, next) => {
    // GUARDAR EL PORCENTAJE DEL PROYECTO //
    const proyecto = await Proyectos.findOne({ where: { id_proyecto: req.body.id_proyecto } });
    const tareasCompletadas = await Tareas.count({
        where: {
            proyectoIdProyecto: proyecto.id_proyecto,
            estatus: 1
        }
    });
    const totalTareas = await Tareas.count({
        where: {
            proyectoIdProyecto: proyecto.id_proyecto,
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

exports.eliminarProyecto = async(req, res, next) => {
    const { url } = req.params;
    const proyecto = await Proyectos.findOne({ where: { url } });
    if (!proyecto) return next();
    const tareas = await Tareas.destroy({ where: { proyectoIdProyecto: proyecto.id_proyecto } });
    proyecto.destroy();
    res.send().status(200);
}

exports.validarProyecto = async(req, res, next) => {
    // VALIDAR ESPACIOS VACIOS
    req.checkBody('nombre_proyecto').trim().notEmpty().withMessage("Debe especificar un nombre para el proyecto.");
    req.checkBody('descripcion_proyecto').trim();
    req.checkBody('fecha_entrega').trim().notEmpty().withMessage("Debe marcar la fecha de entrega.");
    req.checkBody('areas').trim().not().isNumeric().withMessage("El nombre del departamento no puede ser solo números.");
    req.checkBody('color').notEmpty().trim().withMessage("Elija un color para identificar el proyecto.");
    // VALIDAR LONGITUD
    req.checkBody('nombre_proyecto', 'El nombre del proyecto debe ser entre 3 y 50 caracteres.').isLength({ min: 3, max: 50 });
    req.checkBody('descripcion_proyecto', 'La descripción del proyecto no debe exceder los 200 caracteres.').isLength({ min: 0, max: 200 });
    const areasArray = req.body.areas.split(',');
    const weirdCharacters = [',', ' ', '|', '¬', '°', '!', '"', '#', '$', '%', '&', '/', '(', ')', '=', '?', '¡', '¨', '*', '[', ']', ':', ';', '<', '>', "'", '\\', '¿', '´', '~', '+', '{', '}', '^', '`', '"'];
    const set = new Set();
    areasArray.forEach(area => {
        for (let i = 0; i < weirdCharacters.length; i++) {
            area = area.replaceAll(weirdCharacters[i], '');
        }
        if (area == '') {
            return;
        } else if (area < 0 || area > 0) {
            area = "area" + area;
            set.add(area);
        } else {
            set.add(area);
        }
    });
    req.body.areas = [...set].toString();
    console.log(req.body.areas);
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
                totalProyectos,
                proyectosCompletados,
                areas,
                errores
            });
            res.status(401);
            return;
        }
    }
    // SANITIZAR CAMPOS
    req.sanitizeBody('nombre_proyecto').escape();
    req.sanitizeBody('descripcion_proyecto').escape();
    req.sanitizeBody('fecha_entrega').escape();
    req.sanitizeBody('areas').escape();
    req.sanitizeBody('color').escape();
    return next();
}