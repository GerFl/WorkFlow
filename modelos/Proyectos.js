// Se ocupa el ORM
const Sequelize = require('sequelize');
// Traer la BD
const database = require('../config/database');

// Construir la tabla
const Proyectos = database.define('proyectos', {
    id_proyecto: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    nombre_proyecto: Sequelize.STRING(20),
    descripcion_proyecto: Sequelize.STRING(60),
    fecha_inicio: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
    },
    fecha_entrega:Sequelize.DATEONLY,
    porcentaje: Sequelize.STRING(10),
    color: Sequelize.STRING(10),
    completado: Sequelize.INTEGER(1)
},{
	hooks:{
		beforeCreate(proyecto){
			console.log("Antes de insertar en la BD.");
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