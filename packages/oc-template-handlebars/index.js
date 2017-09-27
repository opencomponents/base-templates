'use strict';

const packageJson = require('./package.json');
const render = require('./lib/render');
const generic = require('oc-generic-template-renderer');

module.exports = {
  getInfo() {
    return generic.getInfo(packageJson);
  },
  getCompiledTemplate: generic.getCompiledTemplate,
  render
};
