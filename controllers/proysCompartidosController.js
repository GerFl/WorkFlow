const Usuarios = require('../models/Usuarios');
exports.buscarUsuario = async(req, res, next) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.query.correo
        },
        attributes: ['id_usuario', 'nombre_usuario', 'imagen_perfil']
    })
    if (!usuario) return res.status(403).send();
    console.log(usuario);
    res.send(usuario).status(200);
}