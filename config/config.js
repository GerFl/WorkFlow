const fs = require('fs');
require('dotenv').config({ path: './../variables.env' });

module.exports = {
    development: {
        username: "root",
        password: "root",
        database: "workflow",
        host: "127.0.0.1",
        port: 3307,
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