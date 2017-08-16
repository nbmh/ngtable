const webpack = require('webpack');
const helpers = require('./helpers');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'eval',
  cache: true,
  resolve: {
    extensions: ['.ts', '.js', '.css']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loaders: [{
        loader: '@angularclass/hmr-loader',
        options: {
          pretty: true,
          prod: false
        }
      }, {
        loader: 'awesome-typescript-loader'
      },
      'angular2-template-loader'
    ]
  }, {
    test: /\.html$/,
    use: [{
      loader: 'html-loader',
      options: {
        minimize: false,
        removeComments: false,
        collapseWhitespace: false
      }
    }],
  }, {
    test: /\.scss$/,
    use: [{
      loader: "raw-loader"
    }, {
      loader: "sass-loader"
    }]
  }, {
    test: /\.css$/,
    loader: 'style-loader!css-loader'
  }],
  loaders: [{
    test: /\.ts$/,
    loader: 'ts-loader',
    query: {transpileOnly: true},
    exclude: [/\.(spec|e2e)\.ts$/]
  }]
},

plugins: [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.ContextReplacementPlugin(
    /angular(\\|\/)core(\\|\/)@angular/,
    helpers.root('./src')
  ),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['app', 'polyfills', 'assets']
  }),
  new HtmlWebpackPlugin({
    template: 'example/index.html'
  }),
  new ExtractTextPlugin('[name].css')
],

node: {global: true, progress: false, crypto: 'empty', module: false, clearImmediate: false, setImmediate: false}
};