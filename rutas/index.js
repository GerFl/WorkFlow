// Express Router. Si no pones esto entonces las rutas no funcionan
// Importa
const express=require('express'); // Se trae todas las funciones de express a este archivo
const router=express.Router();

// Importar los controladores

module.exports = function(){ // Para exportar todas las rutas al archivo de index.js
	
	// Ruta para el HOME
	// No podemos usar app como en el index.js porque no se puede crear
	// otra instancia de Express. Por eso se crea router arriba
	// Usamos .get en vez de .use, porque trae información...creo
	router.get('/', (req,res)=>{
		res.render("index");
	}); // Middleware de express
	router.get('/proyecto',(req,res)=>{
		res.render("proyecto");
	});



	return router;
}