// Hay que importar Sequelize para poder utilizar ese ORM
const Sequelize=require('sequelize');

// Bueno, no pude hacerlo en otro puerto jaja estoy bien puñetas
// Configuramos los datos de la BD
// Por lo que entiendo, es un objeto
const database = new Sequelize('workflow','root','root',{
	host:'localhost',
	dialect:'mysql',
	port:'3307',
	operatorAliases:false,
	define:{
		timestamps:true
	},
	pool:{
		max:5,
		min:0,
		acquire:30000,
		idle:10000
	}
});
// El pool indica basicamente:
// número máximo de conexiones abiertas->número mínimo->tiempo de espera
// antes de cerrar la conexión

module.exports=database;

// Después de configurar la BD se exporta para llamarla en el index.js