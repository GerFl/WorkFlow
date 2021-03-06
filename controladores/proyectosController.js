// Llama los modelos
const Proyectos = require('../modelos/Proyectos');
const Tareas = require('../modelos/Tareas');


/* HOME */

/* MOSTRAR PROYECTOS */
exports.mostrarProyectos = async(req, res) => {
    // Buscamos todos los proyectos existentes, los almacenamos en la variable y los pasamos a la vista
    const usuarioId = res.locals.usuario.id_usuario;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioIdUsuario: usuarioId
        }
    });
    res.render('index', {
        nombrePagina: 'WorkFlow',
        proyectos
    });
}


/* LISTAR PROYECTOS */
exports.proyectoUrl = async(req, res, next) => {
    // Consultar los proyectos para que nos retorne el de la url
    // rea.params nos retornará el comodín, el cual es proyectourl
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.proyectourl
        }
    });

    if (!proyecto) return next();

    // PROYECTO EXISTE. Consultar tareas del proyecto actual
    // Se pasa como parametro el id del proyecto. Se accede a el gracias a que hicimos la consulta para traer ese proyecto
    const tareas = await Tareas.findAll({
        where: {
            proyectoIdProyecto: proyecto.id_proyecto
        }
    });

    // Render a la vista
    // Mandamos el proyecto y las tareas dentro de ese proyecto para poder acceder a ellas en la vista
    res.render('proyecto', {
        nombrePagina: "Tareas del proyecto",
        proyecto,
        tareas
    });

}


/* AGREGAR PROYECTO */
exports.formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id_usuario;
    const proyectos = await Proyectos.findAll({
        where: {
            usuarioIdUsuario: usuarioId
        }
    });
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

    const nombre_proyecto = req.body.nombre_proyecto;
    const descripcion_proyecto = req.body.descripcion_proyecto;
    const fecha_entrega = req.body.fecha_entrega;
    const color = req.body.color;
    const porcentaje = 0;
    const completado = 0;
    if (!nombre_proyecto.replace(/\s/g, '').length || !descripcion_proyecto.replace(/\s/g, '').length) {
        const usuarioId = res.locals.usuario.id_usuario;
        const proyectos = await Proyectos.findAll({
            where: {
                usuarioIdUsuario: usuarioId
            }
        });
        const error = "Ningún campo puede ir vacío";
        res.render('agregarProyecto', {
            nombrePagina: 'WorkFlow - Agregar proyecto',
            proyectos,
            error
        });
    } else {
        // Tal vez hacer un apartado para validar errores y otro para agregar a la BD
        const usuarioIdUsuario = res.locals.usuario.id_usuario;
        await Proyectos.create({ nombre_proyecto, descripcion_proyecto, fecha_entrega, porcentaje, color, completado, usuarioIdUsuario })
        res.redirect('/'); // Se insertan los datos en una nueva fila, y se redirecciona.
    }
}

exports.eliminarProyecto = async(req, res, next) => {
    const { url } = req.params;
    const proyecto = await Proyectos.destroy({ where: { url } });

    if (!proyecto) return next();

    res.send("Eliminando proyecto...");

}