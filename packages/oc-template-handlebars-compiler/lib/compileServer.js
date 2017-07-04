'use strict';

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

  compiler(config, (err, compiledServer) => {
    if (err) {
      return callback(err);
    } else {
      fs.ensureDirSync(publishPath);
      fs.writeFile(
        path.join(publishPath, publishFileName),
        compiledServer,
        err => {
          callback(err, {
            type: 'node.js',
            hashKey: hashBuilder.fromString(compiledServer),
            src: publishFileName
          });
        }
      );
    }
  });
};
