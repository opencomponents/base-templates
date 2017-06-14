'use strict';

const MemoryFS = require('memory-fs');
const webpack = require('webpack');

const memoryFs = new MemoryFS();

module.exports = function compiler(options, callback) {
  const config = options.config;
  const compiler = webpack(config);
  compiler.outputFileSystem = memoryFs;

  compiler.run((error, stats) => {
    let softError;
    let warning;

    // handleFatalError
    if (error) {
      return callback(error);
    }

    const info = stats.toJson();
    // handleSoftErrors
    if (stats.hasErrors()) {
      softError = info.errors.toString();
      return callback(softError);
    }
    // handleWarnings
    if (stats.hasWarnings()) {
      warning = info.warnings.toString();
    }

    const log = stats.toString(config.stats || 'errors-only');

    if (log) {
      console.log(log);
    }

    const serverContentBundled = memoryFs.readFileSync(
      '/build/server.js',
      'UTF8'
    );
    callback(warning, serverContentBundled);
  });
};
