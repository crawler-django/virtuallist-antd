const path = require("path");


module.exports = {
	mode: "none",
	entry:"./src/index.tsx",
	devtool: "",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "build"),
		
	},
	externals: [/react/i, /antd/i, /router/i],
	resolve: {
		extensions: [".wasm",".mjs", ".ts", ".js", ".json", ".tsx", ".less"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				enforce: "pre",
				use: [{
				loader: "babel-loader"
				}, {
				loader: "ts-loader"
				}],
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		]
	},

};