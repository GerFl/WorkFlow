const path = require('path');
require('dotenv').config({ path: __dirname + '/../variables.env' });

module.exports = {
    development: {
        username: process.env.LOCAL_USER,
        password: process.env.LOCAL_PASSWORD,
        database: process.env.LOCAL_DATABASE,
        host: process.env.LOCAL_HOST,
        port: process.env.LOCAL_PORT,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        }
    },
    test: {
        username: process.env.LOCAL_USER,
        password: process.env.LOCAL_PASSWORD,
        database: process.env.LOCAL_DATABASE,
        host: process.env.LOCAL_HOST,
        port: process.env.LOCAL_PORT,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        }
    },
    production: {
        username: process.env.PROD_USER,
        password: process.env.PROD_PASSWORD,
        database: process.env.PROD_DATABASE,
        host: process.env.PROD_HOST,
        port: process.env.PROD_PORT,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        }
    }
};