const path = require("path");

module.exports = {
  entry: "./public/custom/index.js", // Entry point for bundling
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "customBundle.js",          // Single bundled file
    library: "customPlugin",              // Library name for the plugin
    libraryTarget: "umd",                 // Universal module definition
  },
  target: "node", // Target Node.js environment
  mode: "production", // Use "development" for debugging
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  externals: {
    // Prevent bundling external dependencies like Node.js built-ins
    fs: "commonjs fs",
    path: "commonjs path",
  },
};
