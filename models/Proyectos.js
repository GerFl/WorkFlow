const Sequelize = require('sequelize');
const database = require('../config/database');
// Librerias para la url
const slug = require('slug');
const shortid = require('shortid');

const Proyectos = database.define('proyectos', {
    id_proyecto: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    nombre_proyecto: Sequelize.STRING(50),
    descripcion_proyecto: Sequelize.STRING(200),
    fecha_inicio: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
    },
    fecha_entrega: Sequelize.DATEONLY,
    porcentaje: Sequelize.STRING(10),
    areas: Sequelize.STRING,
    color: Sequelize.STRING(10),
    url: Sequelize.STRING(100)
}, {
    hooks: {
        beforeCreate(proyecto) {
            // Slug recorta espacios
            const url = slug(proyecto.nombre_proyecto);
            proyecto.url = `${url}-${shortid.generate()}`;
        },
        beforeUpdate(proyecto) {
            console.log("Corriendo el beforeUpdate");
            console.log(proyecto);
        }
    }
});

module.exports = Proyectos;

/*
	Las columnas de "createdAt" y "updatedAt" se generarán siempre
	debido a que en el archivo de configuración se indicó
	que se deben permitir timestamps en la BD.
	Por ende, no declaramos las columnas ya que se generarán de manera
	automática.
*/