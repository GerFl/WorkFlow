(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {
        console.log("Loaded.");

        const enviar = document.querySelector("input.btnEnviar");
        enviar.addEventListener("click", function(e) {
            var color = document.querySelector('input#color');
            alert("Diste click en el botón. El color es " + color.value);
        });
    });
})();