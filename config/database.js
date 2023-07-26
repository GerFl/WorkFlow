const Sequelize = require('sequelize');
const { development, production } = require('./config');
require('dotenv').config({ path: 'variables.env' });

const database = new Sequelize(production.database, production.username, production.password, {
    host: production.host,
    dialect: production.dialect,
    port: production.port,
    operatorAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
// El pool indica basicamente:
// número máximo de conexiones abiertas->número mínimo->tiempo de espera
// antes de cerrar la conexión
module.exports = database;