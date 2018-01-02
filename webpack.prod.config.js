const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var config = require('./webpack.config'),
    webpack = require('webpack');
config.plugins.push(new webpack.optimize.UglifyJsPlugin({sourceMap: true}));
module.exports = config;