const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")


module.exports = {
  entry: "./test/app.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },

      {
        test: /\.styl/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "stylus-loader", "./lib/index.js"]
        })
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new ExtractTextPlugin("styles.css")
  ]
}