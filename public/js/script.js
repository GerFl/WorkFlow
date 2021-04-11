(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
        // console.log("Loaded.");
        // JADE/PUG lets you run unbuffered JavaScript code in the templating engine.

        const animacionCargando = document.querySelector('.loading');
        if (animacionCargando) {
            setTimeout(function() {
                animacionCargando.parentElement.removeChild(animacionCargando.parentElement.childNodes[0]);
            }, 9100);
        }


        const totalTareas = document.querySelectorAll('.tarea');
        const sidebar = document.querySelector('.detallesproyecto');
        const circuloProgreso = document.querySelector('.circulo');
        const btnLogin = document.querySelector('input.btn-login');
        // Eliminacion de proyectos
        const btnEliminar = document.querySelector('a.eliminar');

        const proyectos = document.querySelectorAll('.proyecto a');
        proyectos.forEach(proyecto => {
            // console.log(proyecto.childNodes[5]);
            const fecha_inicio = proyecto.childNodes[4].innerText; // Se extrae el valor
            const fecha_entrega = proyecto.childNodes[5].innerText; // Se extrae el valor
            const firstDate = Date.parse(fecha_inicio); // La fecha de inicio en milisegundos
            const secondDate = Date.parse(fecha_entrega); // La fecha de entrega en milisegundos
            const firstDateDays = firstDate / 86400000; // La fecha en dias enteros
            const secondDateDays = secondDate / 86400000; // La fecha en dias enteros
            const fechaActual = Date.now(); // Pues fecha actual, que no estas viendo
            console.log("Fecha_inicio en formato original: " + fecha_inicio);
            console.log("Fecha_entrega en formato original: " + fecha_entrega);
            console.log("Diferencia entre las fechas: " + (secondDateDays - firstDateDays) + " días.");
            console.log("Mitad de la diferencia entre las fechas: " + (secondDateDays - firstDateDays) / 2 + " días.");
            console.log("Fecha actual en milisegundos: " + fechaActual);
            console.log(fechaActual, secondDate);
            if (fechaActual >= secondDate) { // Fechas en milisegundos para hacer la resta directamente
                // console.log("RED STATUS");
                // console.log("====================");
                // console.log(proyecto.childNodes[6].childNodes[3]);
                proyecto.childNodes[6].childNodes[3].style.opacity = "1";
            } else if ((fechaActual) >= ((secondDate - firstDate) / 2)) {
                // Si los dias de la diferencia entre la fecha de entrega y la fecha actual son mayor o
                // igual a la mitad de la diferencia entre la fecha de entrega y la fecha de inicio, se ejecuta este bloque
                console.log("YELLOW STATUS");
                console.log(((secondDate - fechaActual) / 86400000));
                console.log((((secondDate - firstDate) / 86400000) / 2));
                console.log(((secondDate - fechaActual) / 86400000) - ((secondDateDays - firstDateDays) / 2));
                console.log("====================");
                console.log(proyecto.childNodes[6].childNodes[2]);
                proyecto.childNodes[6].childNodes[2].style.opacity = "1";
            } else { // Ni una ni otra
                // console.log("GREEN STATUS");
                // console.log("====================");
                // console.log(proyecto.childNodes[6].childNodes[1]);
                proyecto.childNodes[6].childNodes[1].style.opacity = "1";
            }
        });

        /*
            1 milisegundo = 0.001 segundos
            1 segundo = 1,000 milisegundos
            1 minuto = 60 segundos = 60,000
            1 hora = 60 minutos = 3,600,000 milisegundos
            1 dia = 24 horas = 86400000 milisegundos
        */

        if (totalTareas.length > 0) {
            conteo();
        }


        // // Cantidad de tareas
        // sidebar.childNodes[1].innerHTML = "Cantidad de tareas: " + totalTareas.length;
        // // Tareas terminadas
        // sidebar.childNodes[2].innerHTML = "Tareas terminadas: " + completadas.length;
        // // Tareas pendientes
        // sidebar.childNodes[3].innerHTML = "Tareas pendientes: " + noCompletadas.length;
        // // Progreso total
        // circuloProgreso.firstChild.innerHTML = porcentajeTotal + "%";
        // const enviar = document.querySelector("input.btnEnviar");
        // Funcion para realizar el conteo de las tareas y hacer las operaciones para mostrar las barras de progreso
        function conteo() {
            // TO-DO
            // Hacer que la barra sea repsponsiva al click de los botones de COMPLETAR o DESCOMPLETAR
            // Hacer que todo el sidebar sea responsivo tambien
            // Selecciona todas las tareas completadas y el total de las tareas, para realizar el calculo del porcentaje
            // Pasarlo todo al sidebaaaaar
            const totalTareas = document.querySelectorAll('.tarea');
            const completadas = document.querySelectorAll('a.completo.activo');
            const noCompletadas = document.querySelectorAll('a.nocompleto.activo');

            //  Selecciona la cantidad de tareas por departamento

            const tareasAnalisis = document.querySelectorAll('p#analisis');
            const tareasDiseno = document.querySelectorAll('p#diseno');
            const tareasCoding = document.querySelectorAll('p#coding');
            const tareasTesting = document.querySelectorAll('p#testing');
            const tareasSoporte = document.querySelectorAll('p#soporte');

            // Selecciona las barras de progreso del departamento para formatear el texto
            const barraAnalisis = document.querySelector('#barraAnalisis');
            const barraDiseno = document.querySelector('#barraDiseno');
            const barraCoding = document.querySelector('#barraCoding');
            const barraTesting = document.querySelector('#barraTesting');
            const barraSoporte = document.querySelector('#barraSoporte');
            // barraAnalisis.parentElement.nextSibling para seleccionar el 5/7 y asi


            // console.log(totalTareas);
            // console.log("Total de tareas: " + totalTareas.length);
            // console.log("Tareas completadas: " + completadas.length);
            // console.log("Tareas no completadas: " + noCompletadas.length);

            // Declaracion de variables para el conteo del total de las tareas completadas por departamento
            var analisisCompletadas = 0;
            var disenoCompletadas = 0;
            var codingCompletadas = 0;
            var testingCompletadas = 0;
            var soporteCompletadas = 0;


            // Pues, no se que onda jaja
            // Si no me equivoco, en esta parte ciclo todo el arreglo del total de tareas para ver el departamento que tienen
            // Mmm, debo hacer que se verifique su sibling para buscar la clase completado
            // UPDATE: se cicla el arreglo totalTareas que fue previamente sacado mas arribita.
            // Se accede a su tercer hijo, el cual es el parrafo, para de ahi extraer el id que se le asigno al parrafo
            // Despues de tener este id se pasa por un switch para filtrar los departamentos, bloque en el cual haremos mucho
            // DOM scripting (se dice asi? si existe ese termino? se escucha chido)
            // Con este DOM scripting va de moviendose desde parrafoId a sus elementos hermanos hasta llegar al div donde tenemos nuestros iconos
            // Y una vez ahi en ese div checamos la etiqueta "<a>" que tenga la clase de activo
            // Finalmente teniendo el resultado de esa busqueda, le sumamos 1 a nuestra variable que declaramos aqui arribita, para tener
            // el conteo de las tareas completadas por departamento.
            totalTareas.forEach(tarea => {
                const parrafoId = tarea.children[2];
                const icono = parrafoId.nextElementSibling.nextElementSibling.firstChild;
                switch (parrafoId.id) {
                    case "analisis":
                        // console.log("El id es de Análisis.");
                        if (icono.classList.contains('activo')) {
                            analisisCompletadas += 1;
                        };
                        break;
                    case "diseno":
                        // console.log("El id es de Diseño.");
                        if (icono.classList.contains('activo')) {
                            disenoCompletadas += 1;
                        };
                        break;
                    case "coding":
                        // console.log("El id es de Código.");
                        if (icono.classList.contains('activo')) {
                            codingCompletadas += 1;
                        };
                        break;
                    case "testing":
                        // console.log("El id es de Testing.");
                        if (icono.classList.contains('activo')) {
                            testingCompletadas += 1;
                        };
                        break;
                    case "soporte":
                        // console.log("El id es de Soporte.");
                        if (icono.classList.contains('activo')) {
                            soporteCompletadas += 1;
                        };
                        break;
                    default:
                        // console.log("El id no es correcto.");
                        break;
                }
            });

            // console.log("Análisis completadas: " + analisisCompletadas);
            // console.log("Diseño completadas: " + disenoCompletadas);
            // console.log("Coding completadas: " + codingCompletadas);
            // console.log("Testing completadas: " + testingCompletadas);
            // console.log("Soporte completadas: " + soporteCompletadas);

            // TO-DO
            // Hacer el code para los progresos en la barra
            // Declarar variables para imprimirlas y pintar las barritas
            var porcentajeAnalisis = ((analisisCompletadas / tareasAnalisis.length).toFixed(2)) * 100;
            var porcentajeDiseno = ((disenoCompletadas / tareasDiseno.length).toFixed(2)) * 100;
            var porcentajeCoding = ((codingCompletadas / tareasCoding.length).toFixed(2)) * 100;
            var porcentajeTesting = ((testingCompletadas / tareasTesting.length).toFixed(2)) * 100;
            var porcentajeSoporte = ((soporteCompletadas / tareasSoporte.length).toFixed(2)) * 100;

            var porcentajeTotal = ((completadas.length / totalTareas.length).toFixed(2)) * 100;
            // console.log(porcentajeTotal.toFixed(2));

            // console.log("Porcentaje análisis: " + porcentajeAnalisis);
            // console.log("Porcentaje diseño: " + porcentajeDiseno);
            // console.log("Porcentaje coding: " + porcentajeCoding);
            // console.log("Porcentaje testing: " + porcentajeTesting);
            // console.log("Porcentaje soporte: " + porcentajeSoporte);

            // Se cambia el texto dentro del parrafo donde se lleva el conteo de las tareas
            barraAnalisis.parentElement.nextElementSibling.innerHTML = analisisCompletadas + "/" + tareasAnalisis.length;
            barraDiseno.parentElement.nextElementSibling.innerHTML = disenoCompletadas + "/" + tareasDiseno.length;
            barraCoding.parentElement.nextElementSibling.innerHTML = codingCompletadas + "/" + tareasCoding.length;
            barraTesting.parentElement.nextElementSibling.innerHTML = testingCompletadas + "/" + tareasTesting.length;
            barraSoporte.parentElement.nextElementSibling.innerHTML = soporteCompletadas + "/" + tareasSoporte.length;

            // Que se hace aqui? Simple. Al inicio se tomaron las barras de color de cada departamento con un querySelector, y ahora solo se formatea el ancho de cada barrita
            // con el calculo que acabamos de hacer arribita con todo el revoltijo de variables y demas cositas
            barraAnalisis.style.width = porcentajeAnalisis + "%";
            barraDiseno.style.width = porcentajeDiseno + "%";
            barraCoding.style.width = porcentajeCoding + "%";
            barraTesting.style.width = porcentajeTesting + "%";
            barraSoporte.style.width = porcentajeSoporte + "%";

            // console.log("Total de tareas: " + totalTareas.length);
            // console.log("Tareas completadas: " + completadas.length);
            // console.log("Tareas no completadas: " + noCompletadas.length);

            // Cantidad de tareas
            sidebar.childNodes[1].innerHTML = "Cantidad de tareas: " + totalTareas.length;
            // Tareas terminadas
            sidebar.childNodes[2].innerHTML = "Tareas terminadas: " + completadas.length;
            // Tareas pendientes
            sidebar.childNodes[3].innerHTML = "Tareas pendientes: " + noCompletadas.length;
            // Progreso total
            circuloProgreso.firstChild.innerHTML = porcentajeTotal.toFixed(0) + "%";
        }

        // if (enviar) {
        //     enviar.addEventListener("click", function(e) {
        //         var color = document.querySelector('input#color');
        //         alert("Diste click en el botón. El color es " + color.value);
        //     });
        // }

        // Bloque para realizar las peticiones a Axios y DOMScripting
        if (totalTareas) {
            const opcionesTarea = document.querySelectorAll('.opcionestarea');
            opcionesTarea.forEach(tarea => {
                tarea.addEventListener('click', e => {
                    if (e.target.classList.contains('fa-check-circle')) {
                        // console.log("Diste click en la palomita");
                        const icono = e.target;
                        const idTarea = icono.parentElement.parentElement.parentElement.dataset.tarea;
                        // console.log(icono);
                        // console.log(icono.parentElement.nextElementSibling);
                        // console.log(idTarea);
                        // Request hacia /tareas/:id
                        const url = `${location.origin}/tarea-completada/${idTarea}`;
                        // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                        axios.patch(url, { idTarea })
                            .then(function(respuesta) {

                                // console.log(icono.parentElement);
                                // console.log(icono.parentElement.nextElementSibling);
                                icono.parentElement.classList.add("activo");
                                icono.parentElement.nextElementSibling.classList.remove("activo");
                                console.log(respuesta);
                                conteo();
                            })
                            // console.log(url);
                    } else if (e.target.classList.contains('fa-times-circle')) {
                        // console.log("Diste click en la x");
                        const icono = e.target;
                        const idTarea = icono.parentElement.parentElement.parentElement.dataset.tarea;
                        // console.log(icono);
                        // console.log(icono.parentElement.previousElementSibling);
                        // console.log(idTarea);
                        // Request hacia /tareas/:id
                        const url = `${location.origin}/tarea-descompletada/${idTarea}`;
                        // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                        axios.patch(url, { idTarea })
                            .then(function(respuesta) {
                                // console.log(icono.parentElement.classList);
                                // console.log(icono.parentElement.previousElementSibling.classList);
                                icono.parentElement.classList.add("activo");
                                icono.parentElement.previousElementSibling.classList.remove("activo");
                                console.log(respuesta);
                                conteo();
                            })
                            // console.log(url);
                    } else {
                        // console.log("Diste click en la x");
                        const icono = e.target;
                        const idTarea = icono.parentElement.parentElement.parentElement.dataset.tarea;
                        // console.log(icono);
                        // console.log(idTarea);

                        // Request hacia /tareas/:id
                        const url = `${location.origin}/tarea-eliminar/${idTarea}`;
                        // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                        axios.delete(url, { idTarea })
                            .then(function(respuesta) {
                                // console.log(icono.parentElement.parentElement.parentElement);
                                icono.parentElement.parentElement.parentElement.remove();
                                console.log(respuesta);
                                conteo();
                            })
                            // console.log(url);
                    }

                });
            });
        }

        // ELIMINAR PROYECTO
        if (btnEliminar) {
            // alert("Existe boton");
            btnEliminar.addEventListener('click', e => {
                // alert("Diste click en el boton");
                const proyecto = document.querySelector('h2');
                const urlProyecto = proyecto.dataset.url;
                // console.log(urlProyecto);

                const url = `${location.origin}/eliminar-proyecto/${urlProyecto}`;

                // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                axios.delete(url, { urlProyecto })
                    .then(function(respuesta) {
                        console.log(respuesta);
                        window.location.href = '/'
                    })

            });
        }

        // Para que funcione en el draft
        // fondo.style.backgroundImage="url('../public/success200.gif')";
        // fondo.style.backgroundImage = "url('../success200.gif')";

    });
})();

/* TO-DO:
    LISTOOOO Seleccionar la cantidad de departamentos
    Hacer las barritas responsivas a ese pedo
    Hacer que los botones funcionen jajaja salv
    Desinstalar AXIOS


*/