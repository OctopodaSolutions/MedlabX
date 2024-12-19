const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  // ... other webpack configuration options ...
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Path to your HTML entry point
    }),
    new webpack.DefinePlugin({
      global:'global'
    }),
    new webpack.ProvidePlugin({
      global: 'global'
    }),
    new Dotenv(),
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      __IS_PLUGIN_MODE__: JSON.stringify(false)
    })
  ],
  entry:'./src/index.tsx',
  devtool: 'inline-source-map',
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  // Add devServer configuration here
  devServer: {
    port: 4000,          // Set the port to 4000
    hot: true,           // Enable hot module replacement
    historyApiFallback: true, // For React Router, if needed
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
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
      },
        {
            test: /\.(js|jsx|ts|tsx)$/,
            // include: /plugins/, // Include the plugins directory,
            exclude:/node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react',
                  '@babel/preset-typescript']
              }
            }
        },
    ],
},
// mode: 'production',

  // ... other webpack configuration options ...
};
