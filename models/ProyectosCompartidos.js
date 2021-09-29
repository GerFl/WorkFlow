const Sequelize = require('sequelize');
const database = require('../config/database');
const Usuarios = require('./Usuarios');
const Proyectos = require('./Proyectos');

const ProyectosCompartidos = database.define('proyectos-compartidos', {
    id_relacion: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    rol: Sequelize.STRING(11),
    area: Sequelize.STRING
});

Usuarios.belongsToMany(Proyectos, { through: ProyectosCompartidos });
Proyectos.belongsToMany(Usuarios, { through: ProyectosCompartidos });

module.exports = ProyectosCompartidos;