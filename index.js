const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({ path: 'variables.env' });

// Inicializar la BD
const database = require('./config/database');
require('./models/Usuarios');
require('./models/Proyectos');
require('./models/Tareas');
require('./models/associations');
// Probar conexion
database.sync()
    .then(() => console.log("Conectado al servidor."))
    .catch(error => console.log(error));

// .use - Para cualquier request, se correra el codigo de ese bloque
// .send - Imprime un resultado
// Crea la aplicacion de express porque si no nada sirve
const app = express();

// Habilitar bodyParser y expressValidator
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
// Habilitar archivos estaticos, template engine y archivos de vistas
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

// Sesiones
app.use(cookieParser());
app.use(session({
    secret: 'itsasecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.usuario = {...req.user } || null;
    next();
})

app.use('/', routes());

// Indicar puerto de ejecucion
app.listen(3001);