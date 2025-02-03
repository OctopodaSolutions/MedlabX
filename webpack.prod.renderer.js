// const config = require('./src/config/config.prod');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
        API_URL: 'https://localhost',
        OTHER_CONSTANT: 'Production Value'
    })
  ],
  // Other prod-specific optimizations (like minification)
};
