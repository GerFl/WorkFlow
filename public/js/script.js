(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
        console.log("Loaded.");

        const enviar = document.querySelector("input.btnEnviar");
        //  Selecciona las tareas que tengan ese departamento
        const tareasAnalisis = document.querySelectorAll('p#analisis');
        const tareasDiseno = document.querySelectorAll('p#diseno');
        const tareasCoding = document.querySelectorAll('p#coding');
        const tareasTesting = document.querySelectorAll('p#testing');
        const tareasSoporte = document.querySelectorAll('p#soporte');
        // Selecciona las barras de progreso del departamento
        const barraAnalisis = document.querySelector('#barraAnalisis');
        const barraDiseno = document.querySelector('#barraDiseno');
        const barraCoding = document.querySelector('#barraCoding');
        const barraTesting = document.querySelector('#barraTesting');
        const barraSoporte = document.querySelector('#barraSoporte');
        // barraAnalisis.parentElement.nextSibling para seleccionar el 5/7 y asi
        // Selecciona todas las tareas completadas
        const completadas = document.querySelectorAll('a.completo.activo');
        const noCompletadas = document.querySelectorAll('a.nocompleto.activo');

        console.log(completadas);
        console.log(noCompletadas);

        /* TO-DO
            Hacer los querys de las tareas completadas en el controlador
        */

        // Se cambia el texto dentro del parrafo donde se lleva el conteo de las tareas
        barraAnalisis.parentElement.nextElementSibling.innerHTML = "# /" + tareasAnalisis.length;
        barraDiseno.parentElement.nextElementSibling.innerHTML = "# /" + tareasDiseno.length;
        barraCoding.parentElement.nextElementSibling.innerHTML = "# /" + tareasCoding.length;
        barraTesting.parentElement.nextElementSibling.innerHTML = "# /" + tareasTesting.length;
        barraSoporte.parentElement.nextElementSibling.innerHTML = "# /" + tareasSoporte.length;

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