// Llama los modelos
const Proyectos = require('../modelos/Proyectos');
const Tareas = require('../modelos/Tareas');

exports.proyectosHome = async(req,res) => {
	res.render('proyecto');
}

exports.agregarProyecto = async(req,res)=>{
	res.render('agregarProyecto');
}