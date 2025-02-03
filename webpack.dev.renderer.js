// const config = require('./src/config/config.dev');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
    //   'process.env.CONFIG': JSON.stringify(config),
    BASE_URL:'localhost',
      API_URL: 'http://localhost:3003',
      OTHER_CONSTANT: 'Development Value'
    })
  ],
  // Other dev-specific settings (like source maps)
};
