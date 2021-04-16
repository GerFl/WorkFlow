const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Hacer referencia al modelo
const Usuarios = require('../modelos/Usuarios');

// Local Strategy - Login con credenciales
passport.use(
    new LocalStrategy(
        // Por default passport espera usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email: email
                    }
                });

                // El usuario existe, password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false);
                }
                // El email existe y el password es correcto
                return done(null, usuario);
            } catch (error) {
                // Ese usuario no existe
                return done(null, false);
            }
        }
    )
);


// Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Exportar
module.exports = passport;