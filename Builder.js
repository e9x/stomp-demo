import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { dirname, join } from 'path';
import { fileURLToPath } from 'node:url';
import Events from 'node:events';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class Builder {
	get_errors(error, stats) {
		const errors = [];

		if (error) {
			errors.push(error);
		}

		if (typeof stats == 'object' && stats !== undefined && stats !== null) {
			for (let error of stats.compilation.errors) {
				errors.push(error);
			}
		}

		return errors;
	}
	constructor(output, bare, stomp, development) {
		const mode = development ? 'development' : 'production';

		this.webpack = webpack({
			mode,
			devtool: 'source-map',
			entry: join(__dirname, 'assets', 'index.js'),
			context: __dirname,
			output: {
				path: output,
				filename: 'main.js',
			},
			plugins: [
				new webpack.DefinePlugin({
					BARE_DIRECTORY: JSON.stringify(bare),
					STOMP_DIRECTORY: JSON.stringify(stomp),
					PRODUCTION: JSON.stringify(!development),
				}),
				new HtmlWebpackPlugin({
					template: join(__dirname, 'assets', 'index.ejs'),
				}),
				new MiniCssExtractPlugin(),
			],
			module: {
				rules: [
					{
						test: /\.css$/,
						use: [MiniCssExtractPlugin.loader, 'css-loader'],
					},
				],
			},
		});
	}
	build() {
		return new Promise((resolve, reject) => {
			this.webpack.run((error, stats) => {
				const errors = this.get_errors(error, stats);

				if (errors.length) {
					reject(errors);
				} else {
					resolve();
				}
			});
		});
	}
	watch() {
		const emitter = new Events();

		const watch = new Promise(resolve =>
			setTimeout(() => {
				resolve(
					this.webpack.watch({}, (error, stats) => {
						const errors = this.get_errors(error, stats);

						if (errors.length) {
							emitter.emit('error', errors);
						} else {
							emitter.emit('bulit');
						}
					})
				);
			})
		);

		emitter.stop = async () => {
			(await watch).close();
		};

		return emitter;
	}
}
