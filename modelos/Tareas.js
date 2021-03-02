// Se ocupa el ORM
const Sequelize=require('sequelize');
// Traer la BD
const database=require('../config/database');
const proyectos=require('./Proyectos');

// Construir la tabla. Se aplica un define como variable para después exportarla
const Tareas = database.define('tareas',{
	id_tarea:{
		type: Sequelize.INTEGER(11)	,
		primaryKey:true,
		autoIncrement:true
	},
	tarea_nombre: Sequelize.STRING(30),
	descripcion_tarea: Sequelize.STRING(60),
	departamento: Sequelize.STRING(15),
	prioridad: Sequelize.INTEGER(1),
	estatus: Sequelize.STRING(10)
});
Tareas.belongsTo(proyectos); // Añadiendo llaves foraneas para relacionar ambas tablas

// Exportar las tareas
module.exports=Tareas;