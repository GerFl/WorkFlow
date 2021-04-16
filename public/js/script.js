(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
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
            const fecha_inicio = Date.parse(proyecto.childNodes[4].innerText); // La fecha de inicio se parsea a milisegundos
            const fecha_entrega = Date.parse(proyecto.childNodes[5].innerText); // La fecha de entrega se parsea a milisegundos
            const diferenciaInicioEntrega = (fecha_entrega - fecha_inicio) / 86400000; // Diferencia en dias entre las fechas
            const fechaActual = Date.now(); // Fecha actual en milisegundos
            const diferenciaActualEntrega = (fecha_entrega - fechaActual) / 86400000;
            // console.log("Fecha de inicio: " + fecha_inicio);
            // console.log("Fecha de entrega: " + fecha_entrega);
            // console.log("Diferencia entre inicio y entrega: " + diferenciaInicioEntrega);
            // console.log("Fecha de inicio en días: " + firstDate);
            // console.log("Fecha de entrega en días: " + secondDate);
            // console.log("Fecha actual: " + fechaActual);
            // console.log("Fecha actual en días: " + fechaActualDias);
            // console.log("Diferencia entre actual y entrega: " + diferenciaActualEntrega);

            if (fechaActual >= fecha_entrega) { // Fechas en milisegundos para hacer la resta directamente
                /* RED STATUS */
                proyecto.childNodes[6].childNodes[3].style.opacity = "1";
            } else if (diferenciaActualEntrega <= (diferenciaInicioEntrega / 2)) {
                /* YELLOW STATUS */
                proyecto.childNodes[6].childNodes[2].style.opacity = "1";
            } else { // Ni una ni otra
                /* GREEN STATUS */
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

        // Funcion para realizar el conteo de las tareas y hacer las operaciones para mostrar las barras de progreso
        function conteo() {
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
                        if (icono.classList.contains('activo')) {
                            analisisCompletadas += 1;
                        };
                        break;
                    case "diseno":
                        if (icono.classList.contains('activo')) {
                            disenoCompletadas += 1;
                        };
                        break;
                    case "coding":
                        if (icono.classList.contains('activo')) {
                            codingCompletadas += 1;
                        };
                        break;
                    case "testing":
                        if (icono.classList.contains('activo')) {
                            testingCompletadas += 1;
                        };
                        break;
                    case "soporte":
                        if (icono.classList.contains('activo')) {
                            soporteCompletadas += 1;
                        };
                        break;
                    default:
                        break;
                }
            });

            // console.log("Análisis completadas: " + analisisCompletadas);
            // console.log("Diseño completadas: " + disenoCompletadas);
            // console.log("Coding completadas: " + codingCompletadas);
            // console.log("Testing completadas: " + testingCompletadas);
            // console.log("Soporte completadas: " + soporteCompletadas);

            var porcentajeAnalisis = ((analisisCompletadas / tareasAnalisis.length).toFixed(2)) * 100;
            var porcentajeDiseno = ((disenoCompletadas / tareasDiseno.length).toFixed(2)) * 100;
            var porcentajeCoding = ((codingCompletadas / tareasCoding.length).toFixed(2)) * 100;
            var porcentajeTesting = ((testingCompletadas / tareasTesting.length).toFixed(2)) * 100;
            var porcentajeSoporte = ((soporteCompletadas / tareasSoporte.length).toFixed(2)) * 100;

            if (totalTareas.length == 0) {
                var porcentajeTotal = 0;
            } else {
                var porcentajeTotal = ((completadas.length / totalTareas.length).toFixed(2)) * 100;
            }

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
            barraAnalisis.style.width = "0%";
            barraDiseno.style.width = "0%";
            barraCoding.style.width = "0%";
            barraTesting.style.width = "0%";
            barraSoporte.style.width = "0%";
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

        // Bloque para realizar las peticiones a Axios y DOMScripting
        if (totalTareas) {
            const opcionesTarea = document.querySelectorAll('.opcionestarea');
            opcionesTarea.forEach(tarea => {
                tarea.addEventListener('click', e => {
                    if (e.target.classList.contains('fa-check-circle')) {
                        const icono = e.target;
                        const idTarea = icono.parentElement.parentElement.parentElement.dataset.tarea;
                        // Request hacia /tareas/:id
                        const url = `${location.origin}/tarea-completada/${idTarea}`;
                        // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                        axios.patch(url, { idTarea })
                            .then(function(respuesta) {
                                icono.parentElement.classList.add("activo");
                                icono.parentElement.nextElementSibling.classList.remove("activo");
                                conteo();
                            })
                    } else if (e.target.classList.contains('fa-times-circle')) { // Al completar
                        const icono = e.target;
                        const idTarea = icono.parentElement.parentElement.parentElement.dataset.tarea;
                        // Request hacia /tareas/:id
                        const url = `${location.origin}/tarea-descompletada/${idTarea}`;
                        // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                        axios.patch(url, { idTarea })
                            .then(function(respuesta) {
                                icono.parentElement.classList.add("activo");
                                icono.parentElement.previousElementSibling.classList.remove("activo");
                                conteo();
                            })
                    } else { // Al descompletar
                        const icono = e.target;
                        const idTarea = icono.parentElement.parentElement.parentElement.dataset.tarea;

                        // Request hacia /tareas/:id
                        const url = `${location.origin}/tarea-eliminar/${idTarea}`;
                        // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                        axios.delete(url, { idTarea })
                            .then(function(respuesta) {
                                icono.parentElement.parentElement.parentElement.remove();
                                conteo();
                            })
                    }

                });
            });
        }

        // ELIMINAR PROYECTO
        if (btnEliminar) {
            btnEliminar.addEventListener('click', e => {
                const proyecto = document.querySelector('h2');
                const urlProyecto = proyecto.dataset.url;

                const url = `${location.origin}/eliminar-proyecto/${urlProyecto}`;

                // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                axios.delete(url, { urlProyecto })
                    .then(function(respuesta) {
                        window.location.href = '/'
                    })

            });
        }

    });
})();