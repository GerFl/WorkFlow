const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/js/main.js',
    output: {
        filename: 'app.js',
        path: path.join(__dirname + '/public/js/')
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
}