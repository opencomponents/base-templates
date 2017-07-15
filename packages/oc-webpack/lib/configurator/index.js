/*jshint camelcase:false */
'use strict';

const BabiliPlugin = require('babili-webpack-plugin');
const externalDependenciesHandlers = require('oc-external-dependencies-handler');
const path = require('path');
const webpack = require('webpack');

module.exports = function webpackConfigGenerator(options) {
  return {
    entry: options.serverPath,
    target: 'node',
    output: {
      path: '/build',
      filename: options.publishFileName,
      libraryTarget: 'commonjs2'
    },
    externals: externalDependenciesHandlers(options.dependencies),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('infinite-loop-loader')
            },
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                presets: [
                  [
                    require.resolve('babel-preset-env'),
                    {
                      modules: false,
                      targets: {
                        node: 4
                      }
                    }
                  ]
                ]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new BabiliPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ],
    logger: options.logger || console,
    stats: options.stats
  };
};
