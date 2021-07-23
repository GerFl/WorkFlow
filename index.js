// Importar
const express = require('express');
const routes = require('./rutas');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// Inicializar la BD
const database = require('./config/database');
// Importar modelos
require('./modelos/Proyectos');
require('./modelos/Tareas');
require('./modelos/Usuarios');
// Probar conexion con la BD
database.sync()
    .then(() => console.log("Conectado al servidor."))
    .catch(error => console.log(error));

// .use - Para cualquier request, se correra el codigo de ese bloque
// .send - Imprime un resultado
// Crea la aplicacion de express porque si no nada sirve gg
const app = express(); // La variable de arriba pasa como funcion. Se crea el servidor

// Habilitar BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
// Validacion de campos
app.use(expressValidator());

// Habilitar archivos estaticos de CSS y JS
app.use(express.static('public'));
// Habilitar el Template Engine
app.set('view engine', 'pug');
// Enlazar el path hacia las vistas
app.set('views', path.join(__dirname, './vistas'));

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
    next();
})

app.use('/', routes()); // Se llama como función porque precisamente se exporto como funcion

// Que no se te olvide decir el puerto en el cual correr
app.listen(3001); // .listen es un método de express