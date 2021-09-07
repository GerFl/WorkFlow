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
        // CONTEO CARACTERES
        const textInputs = document.querySelectorAll('form.feedback input[type="text"]');
        const textAreas = document.querySelectorAll('form.feedback textarea');
        const textEmail = document.querySelector('form.feedback input[type="email"]');
        const textPasswords = document.querySelectorAll('form.feedback input[type="password"]');
        conteoCaracteres(textInputs, textAreas, textEmail, textPasswords);

        function conteoCaracteres(textInputs, textAreas, textEmail, textPasswords) {
            textInputs.forEach(input => {
                input.addEventListener('input', function(e) {
                    e.target.previousElementSibling.childNodes[1].innerText = `${input.value.length}/${input.maxLength}`
                });
            });
            textAreas.forEach(area => {
                area.addEventListener('input', function(e) {
                    e.target.previousElementSibling.childNodes[1].innerText = `${area.value.length}/${area.maxLength}`
                });
            });
            if (textEmail) {
                textEmail.addEventListener('input', function(e) {
                    e.target.previousElementSibling.childNodes[1].innerText = `${textEmail.value.length}/${textEmail.maxLength}`
                });
            }
            if (textPasswords) {
                textPasswords.forEach(password => {
                    password.addEventListener('input', function(e) {
                        e.target.previousElementSibling.childNodes[1].innerText = `${password.value.length}/${password.maxLength}`
                    });
                });
            }
        }
        // FIN CONTEO CARACTERES

        // HAMBURGER
        const btnMenu = document.querySelector('i.fas.fa-bars');
        const sidebar = document.querySelector('aside');
        if (btnMenu && sidebar) {
            btnMenu.addEventListener('click', e => {
                sidebar.style.display = "block";
                const btnCerrarMenu = document.querySelector('i.fas.fa-times');
                btnCerrarMenu.addEventListener('click', e => {
                    (e.target == btnCerrarMenu) ? sidebar.style.display = "none": '';
                });
            });
        }
        // FINHAMBURGER

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
            const fecha_inicio = Date.parse(proyecto.childNodes[4].innerText);
            const fecha_entrega = Date.parse(proyecto.childNodes[5].innerText);
            const diferenciaInicioEntrega = (fecha_entrega - fecha_inicio) / 86400000;
            const fechaActual = Date.now();
            const diferenciaActualEntrega = (fecha_entrega - fechaActual) / 86400000;
            if (fechaActual >= fecha_entrega) {
                /* RED STATUS */
                proyecto.childNodes[6].childNodes[3].style.opacity = "1";
            } else if (diferenciaActualEntrega <= (diferenciaInicioEntrega / 2)) {
                /* YELLOW STATUS */
                proyecto.childNodes[6].childNodes[2].style.opacity = "1";
            } else {
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
        const totalTareas = document.querySelectorAll('.tarea');
        const areas = document.querySelector('input#areas');
        if (totalTareas.length > 0) {
            conteoyPorcentaje(totalTareas, areas);
        }

        function conteoyPorcentaje(totalTareas, areas) {
            resetearBarras();
            if (totalTareas.length == 0) {
                document.querySelector('h3#null-tareas').style.display = "block";
            }
            const tareasArray = []; // Arreglo para guardar distintos departamentos con sus tareas relacionadas
            if (areas.value != '') {
                const departamentosString = areas.value.split(',');
                departamentosString.forEach(departamento => {
                    tareasArray.push(document.querySelectorAll(`.tarea[data-departamento=${departamento}]`));
                });
            }
            let totalCompletadas = 0;
            let totalNoCompletadas = 0;
            tareasArray.forEach(tareasColeccion => {
                let totalTareasDepartamento = 0;
                let tareasCompletadasDepartamento = 0;
                tareasColeccion.forEach(tarea => {
                    totalTareasDepartamento += 1;
                    if (tarea.children[4].children[0].classList.contains('activo')) {
                        tareasCompletadasDepartamento += 1;
                    }
                    document.querySelector(`.barraDepto[data-departamento=${tarea.dataset.departamento}]`).childNodes[1].childNodes[0].style.width = `${(tareasCompletadasDepartamento / totalTareasDepartamento).toFixed(2)*100}%`;
                    document.querySelector(`.barraDepto[data-departamento=${tarea.dataset.departamento}]`).childNodes[2].innerText = `${tareasCompletadasDepartamento}/${totalTareasDepartamento}`;
                })
            });
            totalTareas.forEach(tarea => {
                if (tarea.children[4].children[0].classList.contains('activo')) {
                    totalCompletadas += 1;
                } else {
                    totalNoCompletadas += 1;
                }
            })

            document.querySelector('.detallesproyecto').childNodes[1].innerText = `Cantidad de tareas: ${totalTareas.length}`;
            document.querySelector('.detallesproyecto').childNodes[2].innerText = `Tareas terminadas: ${totalCompletadas}`;
            document.querySelector('.detallesproyecto').childNodes[3].innerText = `Tareas pendientes: ${totalNoCompletadas}`;

            let porcentajeTotal;
            if (totalTareas.length == 0) {
                porcentajeTotal = 0;
            } else {
                porcentajeTotal = ((totalCompletadas / totalTareas.length).toFixed(2)) * 100;
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

        // Axios y DOMScripting
        if (totalTareas) {
            const iconosTarea = document.querySelectorAll('.iconos-tarea');
            iconosTarea.forEach(tarea => {
                tarea.addEventListener('click', e => {
                    e.preventDefault();
                    if (e.target.classList.contains('fa-check-circle')) { // Al completar
                        const icono = e.target;
                        const idTarea = icono.parentElement.parentElement.parentElement.dataset.tarea;
                        const url = `${location.origin}/tarea-completada/${idTarea}`;
                        // No pasamos parametros como tal, sino indicamos la url donde se hara el patch
                        axios.patch(url, { idTarea })
                            .then(function(response) {
                                if (response.status == 200) {
                                    icono.parentElement.classList.add("activo");
                                    icono.parentElement.nextElementSibling.classList.remove("activo");
                                    const totalTareas = document.querySelectorAll('.tarea');
                                    conteoyPorcentaje(totalTareas, areas);
                                } else if (response.status == 401) {
                                    alert("OHOH");
                                }
                            })
                    } else if (e.target.classList.contains('fa-times-circle')) { // Al descompletar
                        const icono = e.target;
                        const idTarea = icono.parentElement.parentElement.parentElement.dataset.tarea;
                        const url = `${location.origin}/tarea-descompletada/${idTarea}`;
                        axios.patch(url, { idTarea })
                            .then(function(response) {
                                if (response.status == 200) {
                                    icono.parentElement.classList.add("activo");
                                    icono.parentElement.previousElementSibling.classList.remove("activo");
                                    const totalTareas = document.querySelectorAll('.tarea');
                                    conteoyPorcentaje(totalTareas, areas);
                                } else if (response.status == 401) {
                                    alert("OHOH");
                                }
                            })
                    }
                });
            });
            const opcionesTarea = document.querySelectorAll('i.fa-ellipsis-v');
            opcionesTarea.forEach(opcion => {
                opcion.addEventListener('click', e => {
                    if (e.target.classList.contains('eliminar-tarea')) { // Al eliminar
                        const accion = e.target;
                        const idTarea = accion.parentElement.parentElement.parentElement.dataset.tarea;
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
                                    // Indicar la url del patch y pasar el ID
                                    axios.delete(url, { idTarea })
                                        .then(function(response) {
                                            if (response.status == 200) {
                                                accion.parentElement.parentElement.parentElement.remove();
                                                const totalTareas = document.querySelectorAll('.tarea');
                                                conteoyPorcentaje(totalTareas, areas);
                                            } else if (response.status == 401) {
                                                alert("OHOH");
                                            }
                                        });
                                }
                            });
                    }
                });
            })
        }

        // AREAS DE TRABAJO PERSONALIZABLES
        const btnAgregarArea = document.querySelector('button.area-trabajo');
        if (btnAgregarArea) {
            btnAgregarArea.addEventListener('click', e => {
                e.preventDefault();
                if (btnAgregarArea.previousElementSibling.lastElementChild.value === '') {
                    btnAgregarArea.previousElementSibling.lastElementChild.style.border = '2px solid var(--incorrecto)';
                    alert("Llene el campo")
                } else {
                    btnAgregarArea.previousElementSibling.lastElementChild.style.border = '2px solid var(--oscuro)';
                    const nuevaArea =
                        `<div>
                            <label>->
                                <span class="feedback">0/25</span>
                            </label>
                            <input type="text" class="area" maxlength="25">
                        </div>`;
                    btnAgregarArea.previousElementSibling.insertAdjacentHTML('afterend', nuevaArea);
                    const textInputs = document.querySelectorAll('form.feedback input[type="text"');
                    conteoCaracteres(textInputs);
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
                    const areaValor = area.value.replaceAll(',', '').replaceAll(' ', '');
                    if (areaValor != '') {
                        setAreas.add(areaValor);
                    }
                })
                inputAreas.value = [...setAreas];
            });
        }
        // FIN AREAS DE TRABAJO PERSONALIZABLES

        // ELIMINAR PROYECTO
        const btnEliminar = document.querySelector('button.eliminar');
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
                            axios.delete(url, { urlProyecto })
                                .then(function(response) {
                                    if (response.status == 200) {
                                        swal("PROYECTO ELIMINADO", "En breve se te redirigirá a la página principal :)", "success");
                                        setTimeout(() => {
                                            window.location.href = '/'
                                        }, 3000);
                                    } else if (response.status == 401) {
                                        alert("OHOH");
                                    }
                                })
                        }
                    });
            });
        }
    });
})();