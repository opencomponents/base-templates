'use strict';

const compileStatics = require('oc-statics-compiler');
const createCompile = require('oc-generic-template-compiler').createCompile;
const getInfo = require('oc-template-es6').getInfo;
const { viteView, viteServer } = require('oc-vite-compiler');
const htmlTemplate = require('./viewTemplate');

const compiler = createCompile({
  compileView: (options, cb) =>
    viteView(
      {
        ...options,
        htmlTemplate,
      },
      cb
    ),
  compileServer: viteServer,
  compileStatics,
  getInfo
});


// OPTIONS
// =======
// componentPath
// componentPackage,
// logger,
// minify
// ocPackage
// publishPath
// verbose,
// watch,
module.exports = compiler;
