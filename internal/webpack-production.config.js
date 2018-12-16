const path = require('path');
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const plugins = [
    require('@babel/plugin-proposal-object-rest-spread'),
    require('@babel/plugin-syntax-export-default-from')
]

module.exports = {
    mode: 'production',
    devtool: "none",
    entry: {
        'calculator': ['./src/index.js'],
        'registry': ['./dev/registry.js'],
    },
    output: {
        path: path.resolve(__dirname, '../dist/js'),
        filename: './[name].bundle.min.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: plugins
                }
            }
        }, {
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, 
            {
                loader: "css-loader",
                options: {
                    importLoaders: 1,
                    minimize: true
                }
            }, 
            {
                loader: "postcss-loader",
                options: {
                    ident: 'postcss',
                    plugins: () => [require('autoprefixer')()]
                }
            }, 
            {
                loader: "sass-loader",
                options: {
                    includePaths: ["./src/styles"]
                }
            }]
        }]
    }
};