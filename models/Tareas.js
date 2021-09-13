const Sequelize = require('sequelize');
const database = require('../config/database');
const Proyectos = require('./Proyectos');
const ProyectosCompartidos = require('./ProyectosCompartidos');

const Tareas = database.define('tareas', {
    id_tarea: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea_nombre: Sequelize.STRING(30),
    descripcion_tarea: Sequelize.STRING(100),
    departamento: Sequelize.STRING,
    prioridad: Sequelize.INTEGER(1),
    estatus: Sequelize.INTEGER(1),
    fecha_inicio: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
    }
});
Tareas.belongsTo(Proyectos); // Añadiendo llaves foraneas para relacionar ambas tablas

module.exports = Tareas;