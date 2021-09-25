import axios from 'axios';
import Swal from 'sweetalert2';

// ELIMINAR PROYECTO
const btnEliminar = document.querySelector('button.eliminar');
if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        e.preventDefault();
        const proyecto = document.querySelector('h2');
        const urlProyecto = proyecto.dataset.url;
        const url = `${location.origin}/eliminar-proyecto/${urlProyecto}`;
        Swal.fire({
                title: "¿Quieres eliminar el proyecto?",
                text: "Esta acción no se puede deshacer.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: 'var(--incorrecto)',
                cancelButtonColor: '',
                confirmButtonText: 'BORRAR',
                cancelButtonText: 'Cancelar'
            })
            .then((result) => {
                if (result.value == true) {
                    axios.delete(url, { urlProyecto })
                        .then(function(response) {
                            if (response.status == 200) {
                                Swal.fire("PROYECTO ELIMINADO", "En breve se te redirigirá a la página principal :)", "success");
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

export default btnEliminar;