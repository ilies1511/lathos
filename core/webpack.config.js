const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		content: './src/contentScript.js',
		background: './src/background.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js'
	},
	plugins: [
		// liest .env und ersetzt process.env.*-Zugriffe
		new Dotenv(),

		// copies manifest to dist/
		new CopyPlugin({
			patterns: [
				{ from: 'src/manifest.json', to: '' }
			]
		})
	]
};
