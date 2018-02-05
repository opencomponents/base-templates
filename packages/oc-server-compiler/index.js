'use strict';

const async = require('async');
const compiler = require('oc-webpack').compiler;
const fs = require('fs-extra');
const hashBuilder = require('oc-hash-builder');
const path = require('path');
const webpackConfigurator = require('oc-webpack').configurator;
const MemoryFS = require('memory-fs');

module.exports = (options, callback) => {
  const { componentPackage, production, publishPath } = options;

  const serverFileName = componentPackage.oc.files.data;
  const serverPath = path.join(options.componentPath, serverFileName);
  const publishFileName = options.publishFileName || 'server.js';
  const stats = options.verbose ? 'verbose' : 'errors-only';
  const dependencies = componentPackage.dependencies || {};

  const config = webpackConfigurator({
    dependencies,
    production,
    publishFileName,
    serverPath,
    stats
  });

  async.waterfall(
    [
      next => compiler(config, next),
      (data, next) => {
        const basePath = path.join(serverPath, '../build');
        const getCompiled = fileName =>
          new MemoryFS(data).readFileSync(`${basePath}/${fileName}`, 'UTF8');

        return fs.ensureDir(publishPath, err => {
          if (err) return next(err);
          const result = { 'server.js': getCompiled('server.js') };

          if (!production) {
            try {
              result['server.js.map'] = getCompiled('server.js.map');
            } catch (e) {
              // skip sourcemap if it doesn't exist
            }
          }

          next(null, result);
        });
      },
      (compiledFiles, next) =>
        async.eachOf(
          compiledFiles,
          (fileContent, fileName, next) =>
            fs.writeFile(path.join(publishPath, fileName), fileContent, next),
          err =>
            next(
              err,
              err
                ? null
                : {
                  type: 'node.js',
                  hashKey: hashBuilder.fromString(
                    compiledFiles[publishFileName]
                  ),
                  src: publishFileName
                }
            )
        )
    ],
    callback
  );
};
