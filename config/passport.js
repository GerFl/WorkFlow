const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/Usuarios');
// Local Strategy - Login con credenciales
passport.use(
    new LocalStrategy(
        // Por default, passport espera usuario y password
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
                // Usuario existe, password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false);
                }
                // Usuario existe, el password es correcto
                return done(null, usuario);
            } catch (error) {
                // Usuario no existe
                return done(null, false);
            }
        }
    )
);

passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;