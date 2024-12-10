const path = require('path');

module.exports = {
    target: 'node',
    entry: './public/index.js',
    output: {
        path: path.resolve(__dirname, 'dist/node'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',
    },
    resolve: {
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    mode: 'production',
};