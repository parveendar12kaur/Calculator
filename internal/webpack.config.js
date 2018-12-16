const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

const plugins = [
    require('@babel/plugin-proposal-object-rest-spread'),
    require('@babel/plugin-syntax-export-default-from')
    ]

const DEV = 'development'
const mode = process.env.NODE_ENV || DEV
const isDev = mode === DEV

module.exports = {
    mode,
    devtool: isDev ? "source-map" : "none",
    devServer: {
       open: true,
       contentBase: ['src','dev', 'dist']
    },
    entry: {
        'TempCalculator': ['./dev/js/TempCalculator.js'],
        'calculatorJS': ['./dev/js/calculatorJS.js'],
        'registry': ['./dev/registry.js'],
        'calculator': ['./src/index.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: './[name].bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [
               path.resolve(__dirname, '../src'),
               path.resolve(__dirname, '../dev/js/TempCalculator.js'),
               path.resolve(__dirname, '../node_modules/@tesla/redux-global-shared-state')
            ],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: plugins
                }
            }
        },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                },
                    {
                        loader: "css-loader",
                        options: {importLoaders: 1, minimize: true}
                    },
                    {
                        loader: "postcss-loader", options: {
                            ident: 'postcss',
                            plugins: () => [require('autoprefixer')()]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            includePaths: ["./../src/styles"]
                        }
                    }]
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
          template: "src/index.html",
          filename: "./index.html"
        })
    ]
};