(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
        console.log("Loaded.");

        const enviar = document.querySelector("input.btnEnviar");

        // Selecciona todas las tareas completadas y el total de las tareas, para realizar el calculo del porcentaje
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


        console.log("Total de tareas: " + totalTareas.length);
        console.log("Tareas completadas: " + completadas.length);
        console.log("Tareas no completadas: " + noCompletadas.length);

        // Ciclar todas las tareas
        var analisisCompletadas = 0;
        var disenoCompletadas = 0;
        var codingCompletadas = 0;
        var testingCompletadas = 0;
        var soporteCompletadas = 0;
        console.log(totalTareas);
        // Pues, no se que onda jaja
        // Si no me equivoco, en esta parte ciclo todo el arreglo del total de tareas para ver el departamento que tienen
        // Mmm, debo hacer que se verifique su sibling para buscar la clase completado
        totalTareas.forEach(tarea => {
            const parrafoId = tarea.children[2];
            switch (parrafoId.id) {
                case "analisis":
                    console.log("El id es de Análisis.");
                    if (parrafoId.nextElementSibling.nextElementSibling.firstChild.classList.contains('activo')) {
                        analisisCompletadas += 1;
                    };
                    break;
                case "diseno":
                    console.log("El id es de Diseño.");
                    if (parrafoId.nextElementSibling.nextElementSibling.firstChild.classList.contains('activo')) {
                        disenoCompletadas += 1;
                    };
                    break;
                case "coding":
                    console.log("El id es de Código.");
                    if (parrafoId.nextElementSibling.nextElementSibling.firstChild.classList.contains('activo')) {
                        codingCompletadas += 1;
                    };
                    break;
                case "testing":
                    console.log("El id es de Testing.");
                    if (parrafoId.nextElementSibling.nextElementSibling.firstChild.classList.contains('activo')) {
                        testingCompletadas += 1;
                    };
                    break;
                case "soporte":
                    console.log("El id es de Soporte.");
                    if (parrafoId.nextElementSibling.nextElementSibling.firstChild.classList.contains('activo')) {
                        soporteCompletadas += 1;
                    };
                    break;
                default:
                    console.log("El id no es correcto.");
                    break;
            }
        });

        console.log(analisisCompletadas);
        console.log(disenoCompletadas);
        console.log(codingCompletadas);
        console.log(testingCompletadas);
        console.log(soporteCompletadas);

        // TO-DO
        // Hacer el code para los progresos en la barra

        // Se cambia el texto dentro del parrafo donde se lleva el conteo de las tareas
        barraAnalisis.parentElement.nextElementSibling.innerHTML = analisisCompletadas + "/" + tareasAnalisis.length;
        barraDiseno.parentElement.nextElementSibling.innerHTML = disenoCompletadas + "/" + tareasDiseno.length;
        barraCoding.parentElement.nextElementSibling.innerHTML = codingCompletadas + "/" + tareasCoding.length;
        barraTesting.parentElement.nextElementSibling.innerHTML = testingCompletadas + "/" + tareasTesting.length;
        barraSoporte.parentElement.nextElementSibling.innerHTML = soporteCompletadas + "/" + tareasSoporte.length;

        if (enviar) {
            enviar.addEventListener("click", function(e) {
                var color = document.querySelector('input#color');
                alert("Diste click en el botón. El color es " + color.value);
            });
        }

    });
})();

/* TO-DO:
    Seleccionar la cantidad de departamentos
    Hacer las barritas responsivas a ese pedo


*/