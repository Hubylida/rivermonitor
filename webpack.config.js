const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  entry: {
    index: './src/views/index/index.js',
    video: './src/views/video/video.js',
    photo: './src/views/photo/photo.js',
    setting: './src/views/setting/setting.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './'
  },
  module: {
    rules: [{
        test: /\.css$/,
        // use: ExtractTextPlugin.extract({
        //   fallback: "style-loader",
        //   use: "css-loader"
        // })
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|mp4)$/,
        use: [
          'file-loader?name=./[name].[ext]'
        ]
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(['dist']),
    new htmlWebpackPlugin({
      template: './src/views/index/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new htmlWebpackPlugin({
      template: './src/views/photo/photo.html',
      filename: 'photo.html',
      chunks: ['photo']
    }),
    new htmlWebpackPlugin({
      template: './src/views/video/video.html',
      filename: 'video.html',
      chunks: ['video']
    }),
    new htmlWebpackPlugin({
      template: './src/views/setting/setting.html',
      filename: 'setting.html',
      chunks: ['setting']
    }),
    new ExtractTextPlugin('css/styles.css'),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  output: {
    filename: 'js/[name].bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  }
};