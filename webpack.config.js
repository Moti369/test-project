const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (webpackConfig) => {
  const config = {
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css']
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            'ts-loader',
            {
              loader: 'tslint-loader',
              options: {
                emitErrors: true
              }
            }
          ],
          include: path.resolve(__dirname, './src')
        },
        {
          test: /\.(js|jsx)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [path.resolve(__dirname, 'src')]
        },
        {
          test: /\.(css|scss)$/,
          loader: 'postcss-loader',
          include: path.resolve(__dirname, './src')
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: './src/index.ejs'
      })
    ]
  };
  return merge(webpackConfig, config);
};
