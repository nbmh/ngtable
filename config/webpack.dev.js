const wmerge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = wmerge(common, {
	devServer: {
    contentBase: 'example'
  },
	entry: {
		assets: './example/assets',
		polyfills: './example/polyfills',
		app: './example/app'
	},
	output: {
		publicPath: '/',
		filename: '[name].bundle.js'
	}
});