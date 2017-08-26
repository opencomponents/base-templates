'use strict';

const async = require('async');
const compiler = require('oc-webpack').compiler;
const fs = require('fs-extra');
const hashBuilder = require('oc-hash-builder');
const path = require('path');
const webpackConfigurator = require('oc-webpack').configurator;
const MemoryFS = require('memory-fs');

module.exports = (options, callback) => {
  const serverFileName = options.componentPackage.oc.files.data;
  const serverPath = path.join(options.componentPath, serverFileName);
  const publishFileName = options.publishFileName || 'server.js';
  const publishPath = options.publishPath;
  const stats = options.verbose ? 'verbose' : 'errors-only';
  const dependencies = options.componentPackage.dependencies || {};

  const config = webpackConfigurator({
    serverPath,
    publishFileName,
    dependencies,
    stats
  });

  async.waterfall(
    [
      next => compiler(config, next),
      (data, next) => {
        const compiledServer = new MemoryFS(data).readFileSync(
          '/build/server.js',
          'UTF8'
        );
        return fs.ensureDir(publishPath, err => next(err, compiledServer));
      },
      (compiledServer, next) =>
        fs.writeFile(
          path.join(publishPath, publishFileName),
          compiledServer,
          err =>
            next(
              err,
              err
                ? null
                : {
                  type: 'node.js',
                  hashKey: hashBuilder.fromString(compiledServer),
                  src: publishFileName
                }
            )
        )
    ],
    callback
  );
};
