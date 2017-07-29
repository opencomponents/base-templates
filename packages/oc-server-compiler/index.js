'use strict';

const async = require('async');
const compiler = require('oc-webpack').compiler;
const fs = require('fs-extra');
const hashBuilder = require('oc-hash-builder');
const path = require('path');
const webpackConfigurator = require('oc-webpack').configurator;

module.exports = (options, callback) => {
  const serverFileName = options.componentPackage.oc.files.data;
  const serverPath = path.join(options.componentPath, serverFileName);
  const publishFileName = options.publishFileName || 'server.js';
  const publishPath = options.publishPath;
  const stats = options.verbose ? 'verbose' : 'errors-only';
  const dependencies = options.componentPackage.dependencies || {};

  const config = webpackConfigurator({
    dependencies,
    publishFileName,
    serverPath,
    stats
  });

  async.waterfall(
    [
      next => compiler(config, next),
      (compiled, next) => fs.ensureDir(publishPath, err => next(err, compiled)),
      (compiled, next) =>
        async.eachOf(
          compiled,
          (bundledFileContent, bundledFileName, next2) => {
            fs.writeFile(
              path.join(publishPath, bundledFileName),
              bundledFileContent,
              next2
            );
          },
          err =>
            next(
              err,
              err
                ? null
                : {
                  type: 'node.js',
                  hashKey: hashBuilder.fromString(compiled[publishFileName]),
                  src: publishFileName
                }
            )
        )
    ],
    callback
  );
};
