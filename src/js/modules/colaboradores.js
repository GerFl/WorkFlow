import Swal from 'sweetalert2';
import axios from 'axios';

/* AGREGAR COLABORADORES */
const btnAgregarColaborador = document.querySelector('button.agregar-colaborador');
const gridColaboradores = document.querySelector('.grid-colaboradores');
const colaboradores = document.querySelectorAll('.colaborador');
const nullColaboradores = document.querySelector('.grid-colaboradores h3');
const setIDColaboradores = new Set();
const inputColaboradores = document.querySelector('input.colaboradores');

console.log(colaboradores);
(colaboradores.length > 0) ? conteoColaboradores(colaboradores): '';

function conteoColaboradores(colaboradores) {
    (colaboradores.length === 0) ? nullColaboradores.style.display = "block": nullColaboradores.style.display = "none";
    colaboradores.forEach(colaborador => {
        // Añadir al set para busquedas
        setIDColaboradores.add(colaborador.dataset.id);
        inputColaboradores.value = [...setIDColaboradores];
        // Para eliminar un colaborador
        colaborador.children[2].addEventListener('click', e => {
            Swal.fire({
                title: '¡Espera!',
                text: "¿De verdad quieres quitar al colaborador de la lista?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--incorrecto)',
                cancelButtonColor: '',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Listo',
                        text: 'Se removió al usuario de la lista de colaboradores. Puedes agregarlo de nuevo si así lo deseas.',
                        icon: 'success',
                        confirmButtonColor: 'var(--color-principal)'
                    })
                    setIDColaboradores.delete(colaborador.dataset.id);
                    inputColaboradores.value = [...setIDColaboradores];
                    colaborador.remove();
                    console.log(setIDColaboradores);
                }
            })
        });
    });
}

if (btnAgregarColaborador) {
    btnAgregarColaborador.addEventListener('click', e => {
        console.log(setIDColaboradores);
        e.preventDefault();
        Swal.fire({
            title: 'Escribe el correo del usuario:',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Buscar',
            confirmButtonColor: 'var(--color-principal)',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const correo = document.querySelector('input.swal2-input').value;
                return axios.get('/usuarios', {
                        params: { correo }
                    })
                    .then(function(response) {
                        if (response.status != 200) {
                            throw new Error(response.statusText)
                        }
                        return response;
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            `Operación fallida: ${error}`
                        )
                    })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                const response = result.value.data;
                if (setIDColaboradores.has((response.id_usuario).toString())) {
                    Swal.fire({
                        title: 'Usuario ya agregado.',
                        confirmButtonColor: 'var(--color-principal)',
                    });
                    return;
                }
                Swal.fire({
                    title: 'Usuario encontrado',
                    html: `
                        <div style="display:flex;justify-content:space-evenly;margin:2rem;">
                            <img src="/profilePics/${response.imagen_perfil}" style="width:10rem;height:10rem">
                            <div>
                                <p style="font-size:2rem;">Nombre:</p>
                                <p style="font-weight:700;font-size:2rem;">${response.nombre_usuario}</p>
                            </div>
                        </div>
                    `,
                    showDenyButton: true,
                    confirmButtonText: 'Agregar',
                    confirmButtonColor: 'var(--color-principal)',
                    denyButtonText: 'Cancelar',
                    denyButtonColor: 'var(--incorrecto)'
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        nullColaboradores.style.display = "none";
                        Swal.fire({
                            title: '¡Colaborador agregado!',
                            icon: 'success',
                            confirmButtonColor: 'var(--color-principal)'
                        });
                        const htmlColaborador = `
                            <div class="colaborador" data-id="${response.id_usuario}">
                                <img src="/profilePics/${response.imagen_perfil}" alt="Profile pic">
                                <div>
                                    <p>${response.nombre_usuario}</p>
                                    <h4>Análisis</h4>
                                </div>
                                <i class="fas fa-trash-alt"></i>
                            </div>
                        `;
                        setIDColaboradores.add((response.id_usuario).toString());
                        gridColaboradores.lastElementChild.insertAdjacentHTML('afterend', htmlColaborador);
                        const colaboradores = document.querySelectorAll('.colaborador');
                        conteoColaboradores(colaboradores);
                    }
                })
            }
        })
    });
}
/* FIN AGREGAR COLABORADORES */
export default btnAgregarColaborador;