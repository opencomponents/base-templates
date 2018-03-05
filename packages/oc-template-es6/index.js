'use strict';

const generic = require('oc-generic-template-renderer');
const packageJson = require('./package.json');

module.exports = {
  getCompiledTemplate: generic.getCompiledTemplate,
  getInfo() {
    return generic.getInfo(packageJson);
  },
  render: generic.render
};
