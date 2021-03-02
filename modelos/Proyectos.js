// Se ocupa el ORM
const Sequelize=require('sequelize');
// Traer la BD
const database=require('../config/database');

// Construir la tabla
const Proyectos=database.define('proyectos',{
	id_proyecto:{
		type: Sequelize.INTEGER(11),
		primaryKey:true,
		autoIncrement:true
	},
	nombre_proyecto:Sequelize.STRING(20),
	descripcion_proyecto:Sequelize.STRING(60),
	fecha_inicio:{
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	/*fecha_entrega:Sequelize.TIMESTAMP,*/
	porcentaje:Sequelize.STRING(10),
	color:Sequelize.STRING(10),
	completado:Sequelize.INTEGER(1);
});

// Exportar los proyectos
module.exports=Proyectos;