import Swal from "sweetalert2";
// El archivo se llama así porque Ben Affleck actúa en una película llamada 'El Contador'
// donde es una persona con autismo y excelentes habilidades matemáticas que utiliza para
// contabilizar los fondos de organizaciones criminales.
function conteoyPorcentaje(totalTareas, areas) {
    if (totalTareas.length == 0) {
        document.querySelector('h3#null-tareas').style.display = "block";
    }
    resetearBarras()
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
            confirmButtonColor: 'var(--color-principal)'
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

export { conteoyPorcentaje };