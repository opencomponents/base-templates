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
    serverPath,
    publishFileName,
    dependencies,
    stats
  });

  let compiledServer;

  async.series(
    [
      next =>
        compiler(config, (err, server) => {
          compiledServer = server;
          next(err);
        }),
      next => fs.ensureDir(publishPath, next),
      next =>
        fs.writeFile(
          path.join(publishPath, publishFileName),
          compiledServer,
          next
        )
    ],
    err => {
      if (err) {
        return callback(err);
      }
      callback(null, {
        type: 'node.js',
        hashKey: hashBuilder.fromString(compiledServer),
        src: publishFileName
      });
    }
  );
};
