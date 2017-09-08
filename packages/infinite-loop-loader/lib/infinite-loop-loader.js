'use strict';

const falafel = require('falafel-sm');
const transformLoopWithLimit = require('./transformLoopWithLimit.js');

module.exports = function(source) {
  let options;
  if (this && this.loaders && this.loaderIndex >= 0) {
    options = this.loaders[this.loaderIndex].options;
  }

  const limit = (options && options.limit) || 1e9;
  const fn = transformLoopWithLimit(limit);
  const opts = (options && options.opts) || {
    allowImportExportEverywhere: true
  };

  const output = falafel(source, opts, fn);
  return output.toString();
};
