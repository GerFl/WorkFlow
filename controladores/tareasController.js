// Llama los modelos
const Proyectos = require('../modelos/Proyectos');
const Tareas = require('../modelos/Tareas');

exports.agregarTarea=async(req,res)=>{
	res.render('agregarTarea');
}