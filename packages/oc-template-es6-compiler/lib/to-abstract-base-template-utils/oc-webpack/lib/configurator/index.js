'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const loaderUtils = require('loader-utils');
const postcssNormalize = require('postcss-normalize');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const createExcludeRegex = require('./createExcludeRegex');

function getLocalIdent(context, localIdentName, localName, options) {
  // Use the filename or folder name, based on some uses the index.js / index.module.(css|scss|sass) project style
  const fileNameOrFolder = context.resourcePath.match(
    /index\.module\.(css|scss|sass)$/
  )
    ? '[folder]'
    : '[name]';
  // Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.
  const hash = loaderUtils.getHashDigest(
    path.posix.relative(context.rootContext, context.resourcePath) + localName,
    'md5',
    'base64',
    5
  );
  // Use loaderUtils to find the file or folder name
  const className = loaderUtils.interpolateName(
    context,
    fileNameOrFolder + '_' + localName + '__' + hash,
    options
  );
  // Remove the .module that appears in every classname when based on the file and replace all "." with "_".
  return className.replace('.module_', '_').replace(/\./g, '_');
}

module.exports = options => {
  const buildPath = options.buildPath || '/build';
  const isEnvProduction = !!options.production;
  const buildIncludes = options.buildIncludes.concat(
    'oc-template-es6-compiler/utils'
  );
  const excludeRegex = createExcludeRegex(buildIncludes);

  const cssLoader = {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          sourceMap: false,
          modules: {
            mode: 'local',
            getLocalIdent
          }
        }
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [
              require('postcss-flexbugs-fixes'),
              [
                require('postcss-preset-env'),
                {
                  autoprefixer: {
                    flexbox: 'no-2009'
                  },
                  stage: 3
                }
              ],
              postcssNormalize()
            ]
          },
          sourceMap: !isEnvProduction
        }
      }
    ].filter(Boolean)
  };

  let plugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].[contenthash:8].chunk.css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        isEnvProduction ? 'production' : 'development'
      )
    })
  ];

  const cacheDirectory = !isEnvProduction;

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
    entry: options.viewPath,
    output: {
      libraryTarget: 'assign',
      library: 'module',
      path: buildPath,
      filename: options.publishFileName
    },
    externals: options.externals,
    module: {
      rules: [
        {
          oneOf: [
            cssLoader,
            {
              test: /\.jsx?$/,
              exclude: excludeRegex,
              loader: require.resolve('babel-loader'),
              options: {
                compact: isEnvProduction,
                cacheDirectory,
                retainLines: true,
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
          ]
        }
      ]
    },
    plugins,
    logger: options.logger || console,
    stats: options.stats
  };
};
