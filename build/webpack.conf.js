const webpack = require('webpack')
const uglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')
const rootPath = path.resolve(__dirname, '../')

const config = {
	mode: 'production',
	entry: {
		'home': path.resolve(rootPath, 'client/js', 'home.js')
	},
	output: {
		filename: `[name].js`,
		path: path.resolve(rootPath, 'app/public/js')
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: "babel-loader",
			options: {
				presets: [
					"env"
				]
			}
		}, {
			test: require.resolve('zepto'),
			loader: 'exports-loader?window.Zepto!script-loader'
		}]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'zepto'
		})
	],
	optimization: {
		minimize: true
	}
}

module.exports = config