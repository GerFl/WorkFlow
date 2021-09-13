const Sequelize = require('sequelize');
const database = require('../config/database');
const Usuarios = require('./Usuarios');
const Proyectos = require('./Proyectos');

const ProyectosCompartidos = database.define('proyectos-compartidos', {
    id_proyecto: {
        type: Sequelize.INTEGER(11),
        references: {
            model: Proyectos,
            key: 'id_proyecto'
        }
    },
    id_usuario: {
        type: Sequelize.INTEGER(11),
        references: {
            model: Usuarios,
            key: 'id_usuario'
        }
    }
});

module.exports = ProyectosCompartidos;