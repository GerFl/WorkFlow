// Ok, el primer paso es hacer este archivo de index.
// El principal porque se inicilizan los módulos que se van a utilizar y se le ordena
// a la app utilizarlos.

// 1- Empecemos con unos const
const express = require('express');
const routes = require('./rutas');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// 2- Traemos la config de la db para inicializarla
const database = require('./config/database');
// Importar el modelo para que sepa qué crear
require('./modelos/Proyectos');
require('./modelos/Tareas');
require('./modelos/Usuarios');
// Probamos la conexión con un promise
database.sync()
    .then(() => console.log("Conectado al servidor."))
    .catch(error => console.log(error));

// .use - Para cualquier request, se correrá el código de ese bloque
// .send - Imprime un resultado
// Crea la aplicación de express porque si no nada sirve gg
const app = express(); // La variable de arriba pasa como función. Se crea el servidor

// Habilitar archivos estáticos de CSS y JS...creo
app.use(express.static('public'));
// Habilitar el Template Engine
app.set('view engine', 'pug');
// Enlazar el path hacia las vistas
app.set('views', path.join(__dirname, './vistas'));
// Habilitar BodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Sesiones
app.use(cookieParser());
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.usuario = {...req.user } || null;
    console.log(res.locals.usuario);
    next();
})

app.use('/', routes()); // Se llama como función porque precisamente se exportó como función

// Ubicación para cargar los archivos estáticos...lo cual no entiendo muy bien por ahora
// app.use(express.static('public'));

// Que no se te olvide decir el puerto en el cual correr
app.listen(3001); // .listen es un método de express