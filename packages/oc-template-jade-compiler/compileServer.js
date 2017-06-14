'use strict';

const fs = require('fs-extra');
const path = require('path');

const configurator = require('./to-be-published/oc-webpack/').configurator;
const compiler = require('./to-be-published/oc-webpack/').compiler;
const hashBuilder = require('./to-be-published/hash-builder');

module.exports = function packageServerScript(options, callback) {
  const serverFileName = options.componentPackage.oc.files.data;
  const serverPath = path.join(options.componentPath, serverFileName);
  const publishFileName = 'server.js';
  const publishPath = options.publishPath;
  const stats = options.verbose ? 'verbose' : 'errors-only';
  const dependencies = options.dependencies || {};

  const config = configurator({
    serverPath,
    publishFileName,
    dependencies,
    stats
  });

  compiler(config, (err, compiledServer) => {
    if (err) {
      return callback(err);
    } else {
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
