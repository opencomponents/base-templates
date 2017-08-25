'use strict';

const jade = require('jade-legacy/runtime.js');
const renderer = require('oc-generic-template-renderer');
const packageJson = require('./package.json');

const context = { jade };

module.exports = {
  getInfo() {
    return renderer.getInfo(packageJson);
  },
  getCompiledTemplate: (templateString, key) =>
    renderer.getCompiledTemplate(templateString, key, context),
  render: renderer.render
};
