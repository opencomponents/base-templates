/*jshint camelcase:false */
'use strict';

const externalDependenciesHandlers = require('oc-external-dependencies-handler');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = function webpackConfigGenerator(options) {
  const isEnvProduction =
    options.production !== undefined ? !!options.production : true;

  const sourceMaps = !isEnvProduction;
  const devtool = sourceMaps ? 'cheap-module-source-map' : false;

  return {
    mode: isEnvProduction ? 'production' : 'development',
    bail: isEnvProduction,
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            keep_classnames: false,
            keep_fnames: false,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          }
        })
      ]
    },
    devtool,
    entry: options.serverPath,
    target: 'node',
    output: {
      path: path.join(options.serverPath, '../build'),
      filename: options.publishFileName,
      libraryTarget: 'commonjs2',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate:
        '[absolute-resource-path]?[contenthash]'
    },
    externals: externalDependenciesHandlers(options.dependencies),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            isEnvProduction && {
              loader: require.resolve('infinite-loop-loader')
            },
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                retainLines: true,
                sourceMaps,
                sourceRoot: path.join(options.serverPath, '..'),
                babelrc: false,
                presets: [
                  [
                    require.resolve('babel-preset-env'),
                    {
                      modules: false,
                      targets: {
                        node: 12
                      }
                    }
                  ]
                ]
              }
            }
          ].filter(Boolean)
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          isEnvProduction ? 'production' : 'development'
        )
      })
    ],
    logger: options.logger || console,
    stats: options.stats
  };
};
