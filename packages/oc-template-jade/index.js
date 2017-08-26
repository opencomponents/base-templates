'use strict';

const jade = require('jade-legacy/runtime.js');
const generic = require('oc-generic-template-renderer');
const packageJson = require('./package.json');

const context = { jade };

module.exports = {
  getInfo() {
    return generic.getInfo(packageJson);
  },
  getCompiledTemplate: (templateString, key) =>
    generic.getCompiledTemplate(templateString, key, context),
  render: generic.render
};
