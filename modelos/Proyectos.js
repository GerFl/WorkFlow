// Se ocupa el ORM
const Sequelize = require('sequelize');
// Traer la BD
const database = require('../config/database');
// Importar las librerias para la url
const slug = require('slug');
const shortid = require('shortid');

// Construir la tabla
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
    color: Sequelize.STRING(10),
    url: Sequelize.STRING(100)
}, {
    hooks: {
        beforeCreate(proyecto) {
            // Con slug recortamos la url de manera que no haya espacios ni cosas raras
            const url = slug(proyecto.nombre_proyecto);
            // Después aplicamos un shortid.generate para que le de valores random
            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

// Exportar los proyectos
module.exports = Proyectos;

/*
	Las columnas de "createdAt" y "updatedAt" se generarán siempre
	debido a que en el archivo de configuración se indicó
	que se deben permitir timestamps en la BD.
	Por ende, no declaramos las columnas ya que se generarán de manera
	automática.
*/