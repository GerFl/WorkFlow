import axios from 'axios';
import { conteoyPorcentaje } from './benAffleck';

// AXIOS AND DOMSCRIPTING
const totalTareas = document.querySelectorAll('.tarea').length;
if (totalTareas > 0) {
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
            if (e.target.classList.contains('eliminar-tarea')) { // Al eliminar la tarea
                const accion = e.target;
                const idTarea = accion.parentElement.parentElement.parentElement.dataset.tarea;
                const url = `${location.origin}/tarea-eliminar/${idTarea}`;
                swal({
                        title: "¿Eliminar tarea?",
                        text: "No se podrá recuperar.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#d93b5b',
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
export default totalTareas;