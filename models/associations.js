const Usuarios = require('./Usuarios');
const Proyectos = require('./Proyectos');
const ProyectosCompartidos = require('./ProyectosCompartidos');

const asociaciones = function() {
    Usuarios.belongsToMany(Proyectos, { through: 'prueba' });
    Proyectos.belongsToMany(Usuarios, { through: 'prueba' });
}

module.exports = asociaciones