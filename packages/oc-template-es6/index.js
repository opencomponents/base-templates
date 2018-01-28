'use strict';

const generic = require('oc-generic-template-renderer');
const packageJson = require('./package.json');

module.exports = {
  getInfo() {
    return generic.getInfo(packageJson);
  },
  getCompiledTemplate: (templateString, key) =>
    generic.getCompiledTemplate(templateString, key, {}),
  render: generic.render
};
