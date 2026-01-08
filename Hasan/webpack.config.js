const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  entry: './index.web.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.web.js', '.js', '.jsx', '.json'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_FOOTBALL_API_KEY': JSON.stringify(process.env.REACT_APP_FOOTBALL_API_KEY || ''),
    }),
  ],
  devServer: {
    port: 1024,
    host: '0.0.0.0', // Tüm network interface'lerinden erişim için
    historyApiFallback: true,
    hot: true,
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'https://api.football-data.org/v4',
        changeOrigin: true,
        secure: true,
        pathRewrite: {
          '^/api': '',
        },
        onProxyReq: (proxyReq, req, res) => {
          // API key'i header'a ekle
          const apiKey = process.env.REACT_APP_FOOTBALL_API_KEY || '';
          if (apiKey) {
            proxyReq.setHeader('X-Auth-Token', apiKey);
          }
        },
      },
    },
  },
};

