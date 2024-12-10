const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const rendererConfig = require('./webpack.renderer.config.js');
const { merge } = require('webpack-merge');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');



const baseConfig = {
  mode: 'development',
  target: 'electron-renderer',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.mp4$/,
        use: 'file-loader?name=videos/[name].[ext]',
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Replaces contentBase
    },
    compress: true,
    port: process.env.HTTP_SERVER,
    hot: true,
    open: true, // Automatically open the browser
    historyApiFallback: true // This option is useful for single-page applications
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Path to your HTML entry point
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      global:'global'
    }),
    new webpack.ProvidePlugin({
      global: 'global'
    }),
    new Dotenv(),
    new NodePolyfillPlugin(),
  ],
  devtool: 'eval-source-map',
  cache: false
};

module.exports = merge(baseConfig,rendererConfig);
