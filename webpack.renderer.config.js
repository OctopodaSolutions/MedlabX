const { merge } = require('webpack-merge');
// const commonConfig = require('./webpack.common.renderer.js');
const devConfig = require('./webpack.dev.renderer.js');
const prodConfig = require('./webpack.prod.renderer.js');

module.exports = (env) => {
  switch (env.NODE_ENV) {
    case 'development':
      return merge(devConfig);
    case 'production':
      return merge(prodConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
}
