const path = require("path");
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const ExtractCssPlugin = require('mini-css-extract-plugin');

const webpackDevServerPort = 8083;
//const proxyTarget = "http://localhost:55041";

module.exports = merge(common, {
    watch: true,
    output: {
        publicPath: '/dist'
    },
    devtool: 'inline-source-map',
    devServer: {
        compress: true,
        //proxy: {
        //    '*': {
        //        target: proxyTarget
        //    }
        //},
        port: webpackDevServerPort,
        contentBase: "src",
        watchContentBase: true,
    },
});