import tareas from './modules/tareas';
import proyectos from './modules/proyectos';
import { conteoyPorcentaje } from './modules/benAffleck';
import colaboradores from './modules/colaboradores';
(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
        // JADE/PUG lets you run unbuffered JavaScript code in the templating engine.
        // MODULE INITIALIZED
        const animacionCargando = document.querySelector('.loading');
        if (animacionCargando) {
            setTimeout(function() {
                window.location.href = '/';
            }, 8000);
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
        // CALENDARIO
        let date = new Date();
        let dia = date.getUTCDate();
        let mes = date.getUTCMonth();
        (dia < 10) ? dia = '0' + dia: '';
        (mes < 9) ? mes = '0' + (mes + 1): '';
        date = date.getFullYear() + '-' + mes + '-' + dia;
        (document.querySelector('input#date')) ? (document.querySelector('input#date')).min = date: '';
        // FIN CALENDARIO

        // HAMBURGER
        const btnMenu = document.querySelector('.menu-movil');
        const sidebar = document.querySelector('aside');
        if (btnMenu && sidebar) {
            btnMenu.addEventListener('click', e => {
                sidebar.style.display = "block";
                sidebar.style.animation = "abrir-transicion-sidebar .3s linear";
                const btnCerrarMenu = document.querySelector('i.fas.fa-times');
                btnCerrarMenu.addEventListener('click', e => {
                    if (e.target == btnCerrarMenu) {
                        sidebar.style.animation = "cerrar-transicion-sidebar .3s linear";
                        sidebar.style.display = "none";
                    }
                });
            });
        }
        // Barra movil
        const barra = document.querySelector('.menu-movil');
        if (window.innerWidth < 768) {
            //Registrar observador
            const observer = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting) {
                    barra.classList.remove('fijo');
                } else {
                    barra.classList.add('fijo');
                }
            });
            // Elemento observado
            observer.observe(document.querySelector('.header-movil'));
        }
        // FINHAMBURGER

        // CONTEO DE TAREAS
        const totalTareas = document.querySelectorAll('.tarea');
        const areas = document.querySelector('input#areas');
        if (totalTareas.length > 0) {
            conteoyPorcentaje(totalTareas, areas);
        }

        // AREAS DE TRABAJO PERSONALIZABLES
        const btnAgregarArea = document.querySelector('button.transparente');
        if (btnAgregarArea) {
            btnAgregarArea.addEventListener('click', e => {
                e.preventDefault();
                if (btnAgregarArea.previousElementSibling.lastElementChild.value === '') {
                    btnAgregarArea.previousElementSibling.lastElementChild.style.border = '2px solid var(--incorrecto)';
                    alert("Llene el campo")
                } else {
                    btnAgregarArea.previousElementSibling.lastElementChild.style.border = '2px solid var(--oscuro)';
                    const htmlNuevaArea =
                        `<div>
                            <label>
                                <span class="feedback">0/25</span>
                            </label>
                            <input type="text" class="area" maxlength="25">
                        </div>`;
                    btnAgregarArea.previousElementSibling.insertAdjacentHTML('afterend', htmlNuevaArea);
                    const textInputs = document.querySelectorAll('form.feedback input[type="text"]');
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

        // CONTEO CARACTERES
        const textInputs = document.querySelectorAll('form.feedback input[type="text"]');
        const textAreas = document.querySelectorAll('form.feedback textarea');
        const textEmail = document.querySelector('form.feedback input[type="email"]');
        const textPasswords = document.querySelectorAll('form.feedback input[type="password"]');
        conteoCaracteres(textInputs, textAreas, textEmail, textPasswords);

        function conteoCaracteres(textInputs, textAreas, textEmail, textPasswords) {
            textInputs.forEach(input => {
                (input.value.length > 0) ? input.previousElementSibling.childNodes[1].innerText = `${input.value.length}/${input.maxLength}`: '';
                input.addEventListener('input', function(e) {
                    e.target.previousElementSibling.childNodes[1].innerText = `${input.value.length}/${input.maxLength}`
                });
            });
            if (textAreas) {
                textAreas.forEach(area => {
                    (area.value.length > 0) ? area.previousElementSibling.firstElementChild.innerText = `${area.value.length}/${area.maxLength}`: '';
                    area.addEventListener('input', function(e) {
                        e.target.previousElementSibling.firstElementChild.innerText = `${area.value.length}/${area.maxLength}`
                    });
                });
            }
            if (textEmail) {
                (textEmail.value.length) ? textEmail.previousElementSibling.childNodes[1].innerText = `${textEmail.value.length}/${textEmail.maxLength}`: '';
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

        // FADINGS
        const popupErrores = document.querySelectorAll('p.error');
        popupErrores.forEach(error => {
            error.style.display = "block"
            setTimeout(function() {
                error.style.display = "none"
            }, 7000)
        });

        // FIN FADINGS
    });
})();