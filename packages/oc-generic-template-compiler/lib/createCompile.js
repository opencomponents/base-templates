'use strict';

const _ = require('lodash');
const async = require('async');
const fs = require('fs-extra');
const getUnixUtcTimestamp = require('oc-get-unix-utc-timestamp');
const path = require('path');

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
module.exports = ({ compileServer, compileView, compileStatics, getInfo }) => (
  options,
  callback
) => {
  const componentPackage = _.cloneDeep(options.componentPackage);
  const ocPackage = options.ocPackage;

  async.waterfall(
    [
      // Compile view
      function(cb) {
        // compiledViewInfo, bundleInfo
        compileView(options, (error, compiledViewInfo) => {
          if (error) {
            return cb(error);
          }
          // USE COMPILATION INFO TO MASSAGE COMPONENT'S PACKAGE
          componentPackage.oc.files.template = compiledViewInfo.template;
          delete componentPackage.oc.files.client;
          cb(error, { componentPackage, compiledViewInfo });
        });
      },
      // Compile dataProvider
      function({ componentPackage, compiledViewInfo }, cb) {
        if (!componentPackage.oc.files.data) {
          return cb(null, componentPackage);
        }
        compileServer(
          Object.assign({}, options, { compiledViewInfo }),
          (error, compiledServerInfo) => {
            if (error) {
              return cb(error);
            }
            // USE COMPILATION INFO TO MASSAGE COMPONENT'S PACKAGE
            componentPackage.oc.files.dataProvider = compiledServerInfo;
            delete componentPackage.oc.files.data;
            cb(error, componentPackage);
          }
        );
      },
      // Compile package.json
      function(componentPackage, cb) {
        componentPackage.oc.files.template.version = getInfo().version;
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
          path.join(options.publishPath, 'package.json'),
          componentPackage,
          error => {
            cb(error, componentPackage);
          }
        );
      },
      // Compile statics
      function(componentPackage, cb) {
        compileStatics(options, error => cb(error, componentPackage));
      }
    ],
    callback
  );
};
