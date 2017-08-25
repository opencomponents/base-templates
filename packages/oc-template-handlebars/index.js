'use strict';

const packageJson = require('./package.json');
const render = require('./lib/render');
const renderer = require('oc-generic-template-renderer');

module.exports = {
  getInfo() {
    return renderer.getInfo(packageJson);
  },
  getCompiledTemplate: renderer.getCompiledTemplate,
  render
};
