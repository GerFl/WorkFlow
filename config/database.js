const Sequelize = require('sequelize');
require('dotenv').config({ path: 'variables.env' });
const database = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql',
    port: process.env.PORT,
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