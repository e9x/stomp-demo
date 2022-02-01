import webpack from "webpack";
import HtmlWebpackPlugin  from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { tomp_directory } from './Config.mjs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function get_errors(error, stats){
	const errors = [];
	
	if(error){
		errors.push(error);
	}
	
	if(typeof stats == 'object' && stats !== undefined && stats !== null){
		for(let error of stats.compilation.errors){
			errors.push(error);
		}
	}

	return errors;
}

const frontend = webpack({
	mode: 'development',
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
				tomp_directory,
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

frontend.watch({}, (error, stats) => {
	const errors = get_errors(error, stats);
	
	if(errors.length){
		for(let error of errors){
			console.error(error);
		}
		
		console.error('Failure building frontend.');
	}else{
		console.log('Successfully built frontend.');
	}
});