const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
// const rendererConfig = require('./webpack.renderer.config.js');
const { merge } = require('webpack-merge');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const baseConfig = {
  mode: 'development',
  target: 'electron-renderer',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      // Handling TypeScript files
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      // Babel for JS files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      // CSS handling
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Image assets
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // Handling MP4 videos
      {
        test: /\.mp4$/,
        use: 'file-loader?name=videos/[name].[ext]',
      },
      // Web workers
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }, // You may want to check if you need to update this loader
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Add TypeScript file extensions
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: process.env.HTTP_SERVER || 3003,
    hot: true,
    open: true, // Automatically open the browser
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      global: 'global',
    }),
    new webpack.ProvidePlugin({
      global: 'global',
    }),
    new Dotenv(),
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      __IS_PLUGIN_MODE__: JSON.stringify(false)
    })
  ],
  devtool: 'eval-source-map',
  cache: false,
};

// module.exports = merge(baseConfig, rendererConfig);
module.exports = baseConfig;

