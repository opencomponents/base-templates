'use strict';

const compileServer = require('oc-server-compiler');
const compileStatics = require('oc-statics-compiler');
const createCompile = require('oc-generic-template-compiler').createCompile;
const getInfo = require('oc-template-jade').getInfo;

const compileView = require('./compileView');

// OPTIONS
// =======
// componentPath
// componentPackage,
// logger,
// minify
// ocPackage
// production
// publishPath
// verbose,
// watch,
module.exports = createCompile({
  compileServer,
  compileStatics,
  compileView,
  getInfo
});
