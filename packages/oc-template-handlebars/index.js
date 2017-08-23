'use strict';

const {
  getCompiledTemplate,
  getInfo
} = require('oc-generic-template-renderer');
const packageJson = require('./package.json');
const render = require('./lib/render');

module.exports = {
  getInfo() {
    return getInfo(packageJson);
  },
  getCompiledTemplate,
  render
};
