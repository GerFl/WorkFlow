// Llama los modelos
const Proyectos = require('../modelos/Proyectos');
const Tareas = require('../modelos/Tareas');

exports.proyectosHome = async(req, res) => {
    const proyectos = await Proyectos.findAll();
    res.render('index', {
        nombrePagina: 'WorkFlow',
        proyectos
    });
}

exports.proyecto = async(req, res) => {
    // Usamos async-await porque es una operación de consulta asíncrona.
    // .findAll() es una función de Sequelize que nos retornará todos los registros en 
    // la tabla de proyectos.
    const proyectos = await Proyectos.findAll();
    console.log(proyectos);
    res.render('proyecto', {
        nombrePagina: 'WorkFlow - Proyecto',
        proyectos
    });
}

exports.formularioProyecto = async(req, res) => {
    const proyectos = await Proyectos.findAll();
    res.render('agregarProyecto', {
        nombrePagina: 'WorkFlow - Agregar proyecto',
        proyectos
    });
}

exports.agregarProyecto = async(req, res, next) => {
    /* 03/03/2021
      OKKK hagamos un breakdown porque si estoy bien noob.
    	Pues primero que nada usé el findAll para ps tener listados todos los proyectos va.
    	¿De qué me sirve? Mmm, no sé, creo que no es necesario alv.
    	** EDIT: Nop, no se ocupa, pero ps ahí lo dejo. **
    	Leemos el request todo picioso para saber que ando enviando va,
    	y luego de eso hice las variables como constantes, accediendo a los valores del request claro está.
    	El porcentaje y el completado son 0 por default. Y el ID por obviedad.
    	Leo el req.body para los datos.
    	Y como todo es un proceso asíncrono, pues hago un await al Proyectos.create
    	donde paso todas las constantes con los parámetros previamente "extraídos"
    	y luego de eso redirecciona al menú principal.

    	Va bien.

    	Como podrás ver hay un res.send antes del await.
    	Saltaba un error cuando quería redirigir la página. El error decía:
    	"ERROR: Can't set headers after they are sent to the client."
    	Lo cual, en mi opinión y experiencia de 5 minutos, significa que no puedes
    	enviar una respuesta más de una vez, es decir, no puedes poner:
    		res.send("Primer respuesta.");
    		res.send("Segunda respuesta.");
    		res.render('vista');
    		res.redirect('/index');
    	Tiene que ser solo una de esas respuestas y ya, si quieres combinalas
    	en el router (creo) pero no una tras otra.
    	¿Ok? Ok
    */
    //const proyectos = await Proyectos.findAll();
    const nombre_proyecto = req.body.nombre_proyecto;
    const descripcion_proyecto = req.body.descripcion_proyecto;
    const fecha_entrega = req.body.fecha_entrega;
    const color = req.body.color;
    const porcentaje = 0;
    const completado = 0;

    console.log("A continuación, el req.body:");
    console.log(req.body);
    //console.log(proyectos.length); // Para saber cuántos proyectos tenemos en total
    // Tal vez hacer un apartado para validar errores y otro para agregar a la BD
    //res.send("Enviaste el formulario para agregar un proyecto.");
    await Proyectos.create({ nombre_proyecto, descripcion_proyecto, fecha_entrega, porcentaje, color, completado })
    res.redirect('/'); // Se insertan los datos en una nueva fila, y se redirecciona.
}

exports.eliminarProyecto = async(req, res, next) => {

}