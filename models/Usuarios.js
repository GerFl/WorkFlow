const Sequelize = require('sequelize');
const database = require('../config/database');
const bcrypt = require('bcrypt-nodejs');
const Proyectos = require('./Proyectos');

const Usuarios = database.define('usuarios', {
    id_usuario: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    nombre_usuario: Sequelize.STRING(60),
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Agrega un correo válido."
            },
            notEmpty: {
                msg: "El email no puede ir vacío."
            }
        },
        unique: {
            args: true,
            msg: "Usuario ya registrado."
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE,
    imagen_perfil: Sequelize.STRING
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

Usuarios.hasMany(Proyectos);

Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = Usuarios;