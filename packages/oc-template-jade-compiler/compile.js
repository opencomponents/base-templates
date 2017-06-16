'use strict';

const compileView = require('./compileView');
const compileServer = require('./compileServer');
const compileStatics = require('./compileStatics');
const async = require('async');
const getUnixUtcTimestamp = require('./to-be-published/get-unix-utc-timestamp');

// OPTIONS
// =======
// watch,
// logger,
// verbose,
// minify
// componentPackage,
// publishPath
// componentPath
module.exports = (options, callback) => {
  const componentPackage = options.componentPackage;
  const ocPackage = options.ocPackage;

  async.waterfall(
    [
      // Compile view
      function(cb) {
        compileView(options, (error, compiledViewInfo) => {
          if (error) {
            return cb(error);
          }
          // USE COMPILATION INFO TO MASSAGE COMPONENT'S PACKAGE
          componentPackage.oc.files.template = compiledViewInfo;
          delete componentPackage.oc.files.client;
          cb(err, componentPackage);
        });
      },
      // Compile dataProvider
      function(componentPackage, cb) {
        if (!componentPackage.oc.files.data) {
          return cb(null, componentPackage);
        }
        compileServer(options, (err, compiledServerInfo) => {
          if (err) {
            return cb(err);
          }
          // USE COMPILATION INFO TO MASSAGE COMPONENT'S PACKAGE
          componentPackage.oc.files.dataProvider = compiledServerInfo;
          delete component.oc.files.data;
          cb(err, componentPackage);
        });
      },
      // Compile package.json
      function(componentPackage, cb) {
        componentPackage.oc.version = ocPackage.version;
        componentPackage.oc.packaged = true;
        componentPackage.oc.date = getUnixUtcTimestamp();
        if (!componentPackage.oc.files.static) {
          componentPackage.oc.files.static = [];
        }
        if (!_.isArray(componentPackage.oc.files.static)) {
          componentPackage.oc.files.static = [componentPackage.oc.files.static];
        }
        fs.writeJson(
          path.join(publishPath, 'package.json'),
          componentPackage,
          err => {
            cb(err, componentPackage);
          }
        );
      },
      // Compile statics
      function(componentPackage, cb) {
        compileStatics(options, err => cb(err, componentPackage));
      }
    ],
    callback
  );
};
