const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  devServer: {
    port: 9000,
    open: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: 12 * 1024,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCSSExtractPlugin(),
    new MomentLocalesPlugin({
      localesToKeep: ['es-us', 'ru'],
    }),
  ],
};
