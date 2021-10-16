const Usuarios = require('../models/Usuarios');
const Proyectos = require('../models/Proyectos');
const ProyectosCompartidos = require('../models/ProyectosCompartidos');

exports.buscarUsuario = async(req, res, next) => {
    const usuario = await Usuarios.findOne({
            where: {
                email: req.query.correo
            },
            attributes: ['id_usuario', 'nombre_usuario', 'imagen_perfil']
        })
        // Si no hay usuario
    if (!usuario) return res.status(403).send();
    // Si el usuario es el autor
    if (usuario.id_usuario === res.locals.usuario.id_usuario) return res.status(200).send("self");
    // Enviar data de usuario nuevo
    res.send(usuario).status(200);
}

exports.agregarRelaciones = async(req, res) => {
    // Agregar el owner
    const owner = await ProyectosCompartidos.create({
        usuarioIdUsuario: res.locals.usuario.id_usuario,
        proyectoIdProyecto: req.proyecto.id_proyecto,
        rol: 'owner',
        area: 'all'
    });
    // Agregar los plebes
    if (req.proyecto.colaboradores) {
        const colaboradores = (req.proyecto.colaboradores).split(',');
        colaboradores.forEach(colaborador => {
            ProyectosCompartidos.create({
                usuarioIdUsuario: colaborador,
                proyectoIdProyecto: req.proyecto.id_proyecto,
                rol: 'colaborador'
            });
        });
    }
    if (req.proyecto.editar === true) return res.redirect(`/proyecto/${req.proyecto.url}`);
    else return res.redirect('/');
}

exports.borrarRelaciones = async(req, res, next) => {
    const proyecto = await Proyectos.findOne({
        where: { url: req.params.proyectourl },
        attributes: ['id_proyecto']
    });
    const borrarRelaciones = await ProyectosCompartidos.destroy({
        where: {
            proyectoIdProyecto: proyecto.id_proyecto
        }
    })
    if (borrarRelaciones) return next();
}