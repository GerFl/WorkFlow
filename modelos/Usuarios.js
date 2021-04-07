const Sequelize = require('sequelize');
const database = require('../config/database');
const bcrypt = require('bcrypt-nodejs');
const Proyectos = require('../models/Proyectos');

// Construir la tabla
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
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El password no puede ir vacío."
            }
        }
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
            console.log("Creando usuario");
            console.log(usuario);
            // usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

Usuarios.hasMany(Proyectos);

// Métodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

// Exportar los usuarios
// module.exports = Usuarios;