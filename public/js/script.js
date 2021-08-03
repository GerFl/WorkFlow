(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
        // JADE/PUG lets you run unbuffered JavaScript code in the templating engine.

        // CALENDARIO
        var date = new Date();
        if (date.getMonth() < 10) {
            date = date.getFullYear() + '-0' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
        } else {
            date = date.getFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
        }
        (document.querySelector('input#date')) ? (document.querySelector('input#date')).min = date: '';
        // FIN CALENDARIO

        // MODULE INITIALIZED
        const animacionCargando = document.querySelector('.loading');
        if (animacionCargando) {
            setTimeout(function() {
                window.location.href = '/';
            }, 9000);
        }

        // SEMAFORO
        const proyectos = document.querySelectorAll('.proyecto a');
        proyectos.forEach(proyecto => {
            const fecha_inicio = Date.parse(proyecto.childNodes[4].innerText); // La fecha de inicio se parsea a milisegundos
            const fecha_entrega = Date.parse(proyecto.childNodes[5].innerText); // La fecha de entrega se parsea a milisegundos
            const diferenciaInicioEntrega = (fecha_entrega - fecha_inicio) / 86400000; // Diferencia en dias entre las fechas
            const fechaActual = Date.now(); // Fecha actual en milisegundos
            const diferenciaActualEntrega = (fecha_entrega - fechaActual) / 86400000;
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
        // FIN SEMAFORO
        /*
            1 milisegundo = 0.001 segundos
            1 segundo = 1,000 milisegundos
            1 minuto = 60 segundos = 60,000
            1 hora = 60 minutos = 3,600,000 milisegundos
            1 dia = 24 horas = 86400000 milisegundos
        */
        // CONTEO
        const totalTareas = document.querySelectorAll('.tarea').length;
        const areas = document.querySelector('input#areas');
        if (totalTareas > 0) {
            conteoyPorcentaje(totalTareas, areas);
        }

        function conteoyPorcentaje(totalTareas, areas) {
            resetearBarras();
            if (totalTareas == 0) {
                document.querySelector('h3#null-tareas').style.display = "block";
            }
            const departamentosString = areas.value.split(',');
            const tareasArray = []; // Arreglo para guardar distintos departamentos con sus tareas relacionadas
            departamentosString.forEach(departamento => {
                tareasArray.push(document.querySelectorAll(`.tarea[data-departamento=${departamento}]`));
            });
            var totalCompletadas = 0;
            var totalNoCompletadas = 0;
            tareasArray.forEach(tareasColeccion => {
                var totalTareasDepartamento = 0;
                var tareasCompletadasDepartamento = 0;
                tareasColeccion.forEach(tarea => {
                    totalTareasDepartamento += 1;
                    if (tarea.children[4].children[0].classList.contains('activo')) {
                        totalCompletadas += 1;
                        tareasCompletadasDepartamento += 1
                    } else {
                        totalNoCompletadas += 1;
                    }

                    document.querySelector(`.barraDepto[data-departamento=${tarea.dataset.departamento}]`).childNodes[1].childNodes[0].style.width = `${(tareasCompletadasDepartamento / totalTareasDepartamento).toFixed(2)*100}%`;
                    document.querySelector(`.barraDepto[data-departamento=${tarea.dataset.departamento}]`).childNodes[2].innerText = `${tareasCompletadasDepartamento}/${totalTareasDepartamento}`;
                })
            })

            document.querySelector('.detallesproyecto').childNodes[1].innerText = `Cantidad de tareas: ${totalTareas}`;
            document.querySelector('.detallesproyecto').childNodes[2].innerText = `Tareas terminadas: ${totalCompletadas}`;
            document.querySelector('.detallesproyecto').childNodes[3].innerText = `Tareas pendientes: ${totalNoCompletadas}`;

            if (totalTareas == 0) {
                var porcentajeTotal = 0;
            } else {
                var porcentajeTotal = ((totalCompletadas / totalTareas).toFixed(2)) * 100;
            }
            const circuloProgreso = document.querySelector('.circulo');
            circuloProgreso.firstChild.innerHTML = porcentajeTotal.toFixed(0) + "%";
            if (porcentajeTotal == 100) {
                Swal.fire({
                    title: '¡FELICIDADES!',
                    text: "Has terminado el proyecto",
                })
            }
        }

        function resetearBarras() {
            const barras = document.querySelectorAll('.barraDepto');
            barras.forEach(barra => {
                barra.childNodes[1].childNodes[0].style.width = "0%";
                barra.childNodes[2].innerText = "0/0";
            })
        }

        // Bloque para realizar las peticiones a Axios y DOMScripting
        if (totalTareas) {
            const opcionesTarea = document.querySelectorAll('.opcionestarea');
            opcionesTarea.forEach(tarea => {
                tarea.addEventListener('click', e => {
                    e.preventDefault();
                    if (e.target.classList.contains('fa-check-circle')) { // Al completar
                        const icono = e.target;
                        const idTarea = icono.parentElement.parentElement.parentElement.dataset.tarea;
                        // Request hacia /tareas/:id
                        const url = `${location.origin}/tarea-completada/${idTarea}`;
                        // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                        axios.patch(url, { idTarea })
                            .then(function(response) {
                                if (response.status == 200) {
                                    icono.parentElement.classList.add("activo");
                                    icono.parentElement.nextElementSibling.classList.remove("activo");
                                    const totalTareas = document.querySelectorAll('.tarea').length;
                                    conteoyPorcentaje(totalTareas, areas);
                                }
                            })
                    } else if (e.target.classList.contains('fa-times-circle')) { // Al descompletar
                        const icono = e.target;
                        const idTarea = icono.parentElement.parentElement.parentElement.dataset.tarea;
                        // Request hacia /tareas/:id
                        const url = `${location.origin}/tarea-descompletada/${idTarea}`;
                        // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                        axios.patch(url, { idTarea })
                            .then(function(response) {
                                if (response.status == 200) {
                                    icono.parentElement.classList.add("activo");
                                    icono.parentElement.previousElementSibling.classList.remove("activo");
                                    const totalTareas = document.querySelectorAll('.tarea').length;
                                    conteoyPorcentaje(totalTareas, areas);
                                }
                            })
                    } else if (e.target.classList.contains('fa-trash-alt')) { // Al eliminar
                        const icono = e.target;
                        const idTarea = icono.parentElement.parentElement.parentElement.dataset.tarea;
                        // Request hacia /tareas/:id
                        const url = `${location.origin}/tarea-eliminar/${idTarea}`;
                        swal({
                                title: "¿Eliminar tarea?",
                                text: "No se podrá recuperar.",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: '#d33',
                                cancelButtonColor: '',
                                confirmButtonText: 'Eliminar tarea',
                                cancelButtonText: 'Cancelar'
                            })
                            .then((result) => {
                                if (result.value == true) {
                                    // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                                    axios.delete(url, { idTarea })
                                        .then(function(response) {
                                            if (response.status == 200) {
                                                icono.parentElement.parentElement.parentElement.remove();
                                                const totalTareas = document.querySelectorAll('.tarea').length;
                                                conteoyPorcentaje(totalTareas, areas);
                                            }
                                        });
                                }
                            });
                    }
                });
            });
        }

        // AREAS DE TRABAJO PERSONALIZABLES
        const agregarArea = document.querySelector('button.areas-trabajo');
        if (agregarArea) {
            agregarArea.addEventListener('click', e => {
                e.preventDefault();
                if (agregarArea.previousElementSibling.lastElementChild.value === '') {
                    agregarArea.previousElementSibling.lastElementChild.style.border = '2px solid var(--incorrecto)';
                } else {
                    agregarArea.previousElementSibling.lastElementChild.style.border = '2px solid var(--oscuro)';
                    const nuevaArea = document.createElement('INPUT');
                    agregarArea.previousElementSibling.appendChild(nuevaArea).classList.add('area');
                }
            });
        }

        const inputBtnEnviar = document.querySelector('input.btnEnviar');
        const inputAreas = document.querySelector('input.set-areas-trabajo');
        if (inputBtnEnviar) {
            inputBtnEnviar.addEventListener('click', e => {
                const areas = document.querySelectorAll('input.area');
                const setAreas = new Set();
                areas.forEach(area => {
                    if (area.value.replaceAll(',', '').replaceAll(' ', '') != '') {
                        setAreas.add(area.value.replaceAll(',', '').replaceAll(' ', ''))
                    }
                })
                inputAreas.value = [...setAreas];
            });
        }
        // FIN AREAS DE TRABAJO PERSONALIZABLES

        // ELIMINAR PROYECTO
        const btnEliminar = document.querySelector('a.eliminar');
        if (btnEliminar) {
            btnEliminar.addEventListener('click', e => {
                e.preventDefault();
                const proyecto = document.querySelector('h2');
                const urlProyecto = proyecto.dataset.url;
                const url = `${location.origin}/eliminar-proyecto/${urlProyecto}`;
                swal({
                        title: "¿Quieres eliminar el proyecto?",
                        text: "Esta acción no se puede deshacer.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '',
                        confirmButtonText: 'BORRAR',
                        cancelButtonText: 'Cancelar'
                    })
                    .then((result) => {
                        if (result.value == true) {
                            // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                            axios.delete(url, { urlProyecto })
                                .then(function(response) {
                                    if (response.status == 200) {
                                        swal("PROYECTO ELIMINADO", "En breve se te redirigirá a la página principal :)", "success");
                                        setTimeout(() => {
                                            window.location.href = '/'
                                        }, 3000);
                                    }
                                })
                        }
                    });
            });
        }
    });
})();