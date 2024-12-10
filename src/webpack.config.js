const Dotenv = require('dotenv-webpack');

module.exports = {
  // ... other webpack configuration options ...
  plugins: [
    new Dotenv(),
    // ... other plugins ...
  ],
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
            test: /\.(js|jsx)$/,
            include: /plugins/, // Include the plugins directory,
            exclude:/node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
        },
    ],
},
  
  
  // ... other webpack configuration options ...
};
