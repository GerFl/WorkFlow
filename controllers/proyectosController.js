const slug = require('slug');
const shortid = require('shortid');
const Usuarios = require('../models/Usuarios');
const Proyectos = require('../models/Proyectos');
const ProyectosCompartidos = require('../models/ProyectosCompartidos');
const Tareas = require('../models/Tareas');

exports.paginaPrincipal = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: { id_usuario: res.locals.usuario.id_usuario },
        attributes: ['id_usuario', 'nombre_usuario', 'imagen_perfil']
    });
    // Busqueda de indices
    const proyectosUsuario = await ProyectosCompartidos.findAll({
        where: {
            usuarioIdUsuario: usuario.id_usuario
        },
        attributes: ['proyectoIdProyecto']
    });
    // Almacenar proyectos del usuario en un arreglo
    let proyectos = [];
    for (let i = 0; i < proyectosUsuario.length; i++) {
        let proyecto = await Proyectos.findOne({
            where: {
                id_proyecto: proyectosUsuario[i].proyectoIdProyecto
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
    // Obtiene proyecto
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });
    if (!proyecto) return next();
    // Obtiene rol
    const permisos = await ProyectosCompartidos.findOne({
        where: { usuarioIdUsuario: res.locals.usuario.id_usuario },
        attributes: ['rol', 'area']
    })

    // SI EL PROYECTO EXISTE
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
        areas,
        permisos
    });
}

// Vista formulario para agregar
exports.formularioProyecto = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: { id_usuario: res.locals.usuario.id_usuario },
        attributes: ['id_usuario', 'nombre_usuario', 'imagen_perfil']
    });
    // Encontrar todas las relaciones del usuario actual
    // proyectosUsuario almacena los indices de las relaciones del modelo ProyectosCompartidos
    const proyectosUsuario = await ProyectosCompartidos.findAll({
        where: {
            usuarioIdUsuario: usuario.id_usuario
        },
        attributes: ['proyectoIdProyecto']
    });
    // Buscar los proyectos iterando con los indices de las relaciones
    // totalProyectos almacena la información de los proyectos del modelo Proyectos
    let totalProyectos = [];
    for (let i = 0; i < proyectosUsuario.length; i++) {
        let proyecto = await Proyectos.findOne({
            where: {
                id_proyecto: proyectosUsuario[i].proyectoIdProyecto
            }
        });
        totalProyectos.push(proyecto);
    }
    // Marcar los proyectos completados
    let proyectosCompletados = 0;
    for (let i = 0; i < totalProyectos.length; i++) {
        (totalProyectos[i].porcentaje == 100) ? proyectosCompletados += 1: '';
    }
    res.render('formulariosProyecto', {
        nombrePagina: 'WorkFlow - Agregar proyecto',
        titulo: "Agregar proyecto",
        actionForm: "/agregar-proyecto",
        totalProyectos: totalProyectos.length,
        proyectosCompletados,
        usuario
    });
}

exports.formularioEditarProyecto = async(req, res, next) => {
    // Encontrar todas las relaciones del usuario actual
    const proyectosUsuario = await ProyectosCompartidos.findAll({
        where: {
            usuarioIdUsuario: res.locals.usuario.id_usuario
        },
        attributes: ['proyectoIdProyecto']
    });
    // Buscar en los proyectos iterando con los indices de proyectosCompartidos
    let totalProyectos = [];
    for (let i = 0; i < proyectosUsuario.length; i++) {
        let proyecto = await Proyectos.findOne({
            where: {
                id_proyecto: proyectosUsuario[i].proyectoIdProyecto
            }
        });
        totalProyectos.push(proyecto);
    }
    // Marcar los proyectos completados
    let proyectosCompletados = 0;
    for (let i = 0; i < totalProyectos.length; i++) {
        (totalProyectos[i].porcentaje == 100) ? proyectosCompletados += 1: '';
    }
    // Obtener el proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: req.params.proyectourl } });
    const areas = proyecto.areas.split(',');
    // Buscar las tareas
    const totalTareas = await Tareas.count({ where: { proyectoIdProyecto: proyecto.id_proyecto } });
    const tareasCompletadas = await Tareas.count({ where: { proyectoIdProyecto: proyecto.id_proyecto, estatus: 1 } });
    // Obtener los colaboradores
    const indices = await ProyectosCompartidos.findAll({
        where: { proyectoIdProyecto: proyecto.id_proyecto },
        attributes: ['usuarioIdUsuario', 'area']
    });
    let colaboradores = [];
    for (let i = 0; i < indices.length; i++) {
        let colaborador = await Usuarios.findOne({
            where: { id_usuario: indices[i].usuarioIdUsuario },
            attributes: ['id_usuario', 'nombre_usuario', 'imagen_perfil']
        });
        if (colaborador && colaborador.id_usuario != res.locals.usuario.id_usuario) colaboradores.push(colaborador);
    }
    res.render('formulariosProyecto', {
        nombrePagina: `WorkFlow - Editar proyecto: ${proyecto.nombre_proyecto}`,
        titulo: `Editar proyecto:${proyecto.nombre_proyecto}`,
        actionForm: `/proyecto/${proyecto.url}/editar-proyecto`,
        proyecto,
        totalProyectos,
        proyectosCompletados,
        areas,
        totalTareas,
        tareasCompletadas,
        colaboradores
    });
}

exports.agregarProyecto = async(req, res, next) => {
    // Se extraen los valores
    const { nombre_proyecto, descripcion_proyecto, fecha_entrega, areas, color, colaboradores } = req.body;
    // Se crea
    const proyecto = await Proyectos.create({
        nombre_proyecto,
        descripcion_proyecto,
        fecha_entrega,
        porcentaje: 0,
        areas,
        color,
        completado: 0
    });
    // Añadir al request
    req.proyecto = proyecto;
    (colaboradores != '') ? req.proyecto.colaboradores = colaboradores: '';
    req.proyecto.editar = false;
    // Middleware de proysCompartidosController
    if (proyecto) return next();
}

exports.editarProyecto = async(req, res, next) => {
    // Obtiene rol
    const permisos = await ProyectosCompartidos.findOne({
        where: { usuarioIdUsuario: res.locals.usuario.id_usuario },
        attributes: ['rol']
    })
    if (permisos.rol != "owner") return res.redirect(`/proyecto/${req.params.proyectourl}`);
    // SI TIENE PERMISO
    var url = req.params.proyectourl;
    const proyecto = await Proyectos.findOne({ where: { url } });
    const { nombre_proyecto, descripcion_proyecto, fecha_entrega, areas, color, colaboradores } = req.body;
    if (proyecto.nombre_proyecto != nombre_proyecto) {
        url = `${slug(nombre_proyecto)}-${shortid.generate()}`;
    }
    proyecto.nombre_proyecto = nombre_proyecto;
    proyecto.descripcion_proyecto = descripcion_proyecto;
    proyecto.fecha_entrega = fecha_entrega;
    proyecto.areas = areas;
    proyecto.color = color;
    proyecto.url = url;
    proyecto.save();
    // Añadir al request
    req.proyecto = proyecto;
    (colaboradores != '') ? req.proyecto.colaboradores = colaboradores: '';
    req.proyecto.editar = true;
    // Middleware de proysCompartidosController
    if (proyecto) return next();
}

exports.actualizarPorcentaje = async(req, res, next) => {
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
    // Obtiene rol
    const permisos = await ProyectosCompartidos.findOne({
        where: { usuarioIdUsuario: res.locals.usuario.id_usuario },
        attributes: ['rol']
    })
    if (permisos.rol != "owner") return res.redirect(`/proyecto/${req.params.proyectourl}`);
    // SI TIENE PERMISO
    const { url } = req.params;
    const proyecto = await Proyectos.findOne({ where: { url } });
    if (!proyecto) return next();
    const tareas = await Tareas.destroy({ where: { proyectoIdProyecto: proyecto.id_proyecto } });
    const proyectosCompartidos = await ProyectosCompartidos.destroy({ where: { proyectoIdProyecto: proyecto.id_proyecto } });
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
    req.checkBody('colaboradores').trim();
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
    req.sanitizeBody('colaboradores').escape();
    return next();
}