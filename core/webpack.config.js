// const path = require('path');
// const Dotenv = require('dotenv-webpack');

// module.exports = {
// 	mode: 'development',
// 	entry: {
// 		background: './src/background.js',
// 		content: './src/contentScript.js'
// 	},
// 	output: {
// 		filename: '[name].bundle.js',
// 		path: path.resolve(__dirname, 'dist')
// 	},
// 	plugins: [
// 		new Dotenv()               // lädt .env und macht process.env.* verfügbar
// 	]
// };

// // webpack.config.js (Auszug)
// const CopyPlugin = require("copy-webpack-plugin");

// module.exports = {
//   // …
//   plugins: [
//     new CopyPlugin({
//       patterns: [
//         { from: "src/manifest.json", to: "" },
//         { from: "src/options.html",   to: "" },
//         { from: "src/icons",          to: "icons" },
// 		new Dotenv()               // lädt .env und macht process.env.* verfügbar
//       ]
//     })
//   ]
// };



// webpack.config.js
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
	mode: 'development',
	entry: {
		content: './src/contentScript.js',
		background: './src/background.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		// lädt .env und macht process.env.* verfügbar
		new Dotenv(),

		// kopiert Manifest, HTML & Icons in dist/
		new CopyPlugin({
			patterns: [
				{ from: 'src/manifest.json', to: '' },
				{ from: 'src/options.html', to: '' },
				{ from: 'src/icons', to: 'icons' }
			]
		})
	]
};
