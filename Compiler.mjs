import fs from 'fs';
import path from 'path';
import webpack from "webpack";
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin  from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { tompserver } from './ServerInstance.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'toomanyproxies', 'package.json')));

function compilation_errors(error, stats = { compilation: { errors: [] } }){
	var had_error = false;
	
	if(error){
		had_error = true;
		console.error(error);
	}
	
	for(let error of stats.compilation.errors){
		console.error(error);
	}
	
	return had_error;
}

const frontend = webpack({
	mode: 'production',
	devtool: 'source-map',
	entry: path.join(__dirname, 'assets', 'index.mjs'),
	context: __dirname,
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'main.js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'assets', 'index.ejs'),
			templateParameters: {
				pkg,
				tompserver,
			},
		}),
		new MiniCssExtractPlugin()
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
				],
			},
		],
	},
});

frontend.watch({}, (...args) => {
	if (!compilation_errors(...args)) console.log('Successful build of frontend.');
	else console.error('Failure building frontend.');
});