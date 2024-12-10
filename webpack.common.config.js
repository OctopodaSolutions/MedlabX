module.exports = {
    plugins: [
      new webpack.DefinePlugin({

        'process.env.NAME': "gspec"
//         'process.env.NAME': "XCSM"

      })
    ],
    // Other prod-specific optimizations (like minification)
  };
  