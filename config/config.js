const path = require('path');
require('dotenv').config({ path: __dirname + '/../variables.env' });

module.exports = {
    development: {
        username: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        host: process.env.HOST,
        port: process.env.PORT,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        }
    },
    test: {
        username: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        host: process.env.HOST,
        port: process.env.PORT,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        }
    },
    production: {
        username: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        host: process.env.HOST,
        port: process.env.PORT,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        }
    }
};