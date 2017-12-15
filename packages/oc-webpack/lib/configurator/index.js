/*jshint camelcase:false */
'use strict';

const MinifyPlugin = require('babel-minify-webpack-plugin');
const externalDependenciesHandlers = require('oc-external-dependencies-handler');
const path = require('path');
const webpack = require('webpack');

module.exports = function webpackConfigGenerator(options) {
  const buildPath = options.buildPath || '/build';
  const production =
    options.production !== undefined ? options.production : 'true';

  const jsLoaders = [
    {
      loader: require.resolve('babel-loader'),
      options: {
        cacheDirectory: true,
        babelrc: false,
        presets: [
          [
            require.resolve('babel-preset-env'),
            {
              modules: false,
              targets: {
                node: 6
              }
            }
          ]
        ],
        plugins: [
          [require.resolve('babel-plugin-transform-object-rest-spread')]
        ]
      }
    }
  ];

  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        production ? 'production' : 'development'
      )
    })
  ];

  if (production) {
    jsLoaders.unshift({
      loader: require.resolve('infinite-loop-loader')
    });
    plugins.unshift(new MinifyPlugin());
  }

  return {
    entry: options.serverPath,
    target: 'node',
    output: {
      path: buildPath,
      filename: options.publishFileName,
      libraryTarget: 'commonjs2'
    },
    externals: externalDependenciesHandlers(options.dependencies),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: jsLoaders
        }
      ]
    },
    plugins,
    logger: options.logger || console,
    stats: options.stats
  };
};
