/*jshint camelcase:false */
'use strict';

const externalDependenciesHandlers = require('oc-external-dependencies-handler');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = function webpackConfigGenerator(options) {
  const dest = path.join(options.serverPath, '../build');

  return {
    devtool: '#source-map',
    entry: options.serverPath,
    target: 'node',
    output: {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
      filename: options.publishFileName,
      libraryTarget: 'commonjs2',
      path: dest
    },
    externals: externalDependenciesHandlers(options.dependencies),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                retainLines: true,
                sourceMaps: true,
                sourceRoot: path.join(options.serverPath, '..'),
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
            },
            {
              loader: require.resolve('infinite-loop-loader')
            }
          ]
        }
      ]
    },
    plugins: [
      new UglifyJSPlugin({
        parallel: true,
        sourceMap: {
          filename: `${dest}/server.js`,
          url: `${dest}/server.js.map`
        }
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ],
    logger: options.logger || console,
    stats: options.stats
  };
};
