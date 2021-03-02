// Ya no te necesito UpTaskNodeJs

// Ok, el primer paso es hacer este archivo de index. JuanPa se refiere a él como el archivo principal,
// creo que es porque se inicilizan los módulos que se van a utilizar y se le ordena
// a la app utilizarlos.

// 1- Empecemos con unos const
const express=require('express');
const routes=require('./rutas');
const path = require('path');

// 2- Traemos la config de la db para inicializarla
const database=require('./config/database');
// Probamos la conexión con un promise
database.sync()
	.then(()=>console.log("Conectado al servidor."))
	.catch(error=>console.log(error));

// .use - Para cualquier request, se correrá el código de ese bloque
// .send - Imprime un resultado
// Crea la aplicación de express porque si no nada sirve gg
const app=express(); // La variable de arriba pasa como función. Se crea el servidor

// Habilitar archivos estáticos de CSS y JS...creo
app.use(express.static('public'));
// Habilitar el Template Engine
app.set('view engine','pug');
// Enlazar el path hacia las vistas
app.set('views',path.join(__dirname,'./vistas'));

app.use('/',routes()); // Se llama como función porque precisamente se exportó como función

// Ubicación para cargar los archivos estáticos...lo cual no entiendo muy bien por ahora
// app.use(express.static('public'));

// Que no se te olvide decir el puerto en el cual correr
app.listen(3001); // .listen es un método de express