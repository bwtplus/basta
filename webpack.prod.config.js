const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PostCssImport = require("postcss");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './static/js/main.js',
    './static/scss/style.scss'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static/dist')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'static/scss'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        loaders: [
            'file-loader?hash=sha512&digest=hex&name=[name].[ext]',
            'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name(file) {
            return '[name].[ext]'
          }
        }
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'static/js'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: {
                  browsers: ['last 2 versions']
                },
                modules: false
              }
              ]
            ],
            plugins: ['transform-runtime']
          }
        }
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    }),
    new ExtractTextPlugin("bundle.css"),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
	new FaviconsWebpackPlugin({
		logo: '.\\static\\img\\logo.png',
		prefix: 'icons/',
		emitStats: true,
		// The name of the json containing all favicon information
		statsFilename: 'iconstats.json',
		persistentCache: true,
		// Inject the html into the html-webpack-plugin
		inject: true,
		icons: {
		  android: true,
		  appleIcon: true,
		  appleStartup: true,
		  coast: false,
		  favicons: true,
		  firefox: true,
		  opengraph: false,
		  twitter: false,
		  yandex: false,
		  windows: false
		}
	})
  ]
};