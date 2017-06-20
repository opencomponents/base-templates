'use strict';

const compile = require('./lib/compile');
const template = require('oc-template-jade');

module.exports = {
  compile,
  getInfo: template.getInfo,
  getCompiledTemplate: template.getCompiledTemplate,
  render: template.render
};
