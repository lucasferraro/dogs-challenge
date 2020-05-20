'use strict'

const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: "inline-cheap-module-source-map",
  entry: "./src/app.js",
  devServer: {
    hot: true,
    watchOptions: {
      poll: true
    },
    clientLogLevel: 'error'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(scss|css)$/,
        use: [
          "vue-style-loader",
          "css-loader",
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
}
