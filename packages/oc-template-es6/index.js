'use strict';

const generic = require('oc-generic-template-renderer');
const packageJson = require('./package.json');

module.exports = {
  ...generic,
  getInfo() {
    return generic.getInfo(packageJson);
  }
};
