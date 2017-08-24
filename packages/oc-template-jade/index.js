'use strict';

const { getInfo, render } = require('oc-generic-template-renderer');
const getCompiledTemplate = require('./lib/getCompiledTemplate');
const packageJson = require('./package.json');

module.exports = {
  getInfo() {
    return getInfo(packageJson);
  },
  getCompiledTemplate,
  render
};
