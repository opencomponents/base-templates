'use strict';

const compileView = require('./compileView');
const async = require('async');

// const async = require('async');
// const packageServerScript = require('./package-server-script');
// const packageStaticFiles = require('./package-static-files');
// const packageTemplate = require('./package-template');
// const getUnixUtcTimestamp = require('../../utils/get-unix-utc-timestamp');

module.exports = (options, callback) => {
  // OPTIONS
  // =======
  // watch,
  // logger,
  // verbose,
  // minify
  // packageInfo,
  // publishPath
  // componentPath

  async.waterfall(
    [
      function(cb) {
        // Packaging template.js
        compileView(
          {
            componentPath: componentPath,
            componentPackage: component
          },
          (err, packagedTemplateInfo) => {
            if (err) {
              return cb(err);
            }

            component.oc.files.template = packagedTemplateInfo;
            delete component.oc.files.client;
            cb(err, component);
          }
        );
      },
      function(component, cb) {
        // Packaging server.js

        if (!component.oc.files.data) {
          return cb(null, component);
        }

        packageServerScript(
          {
            componentPath: componentPath,
            dependencies: component.dependencies,
            ocOptions: component.oc,
            publishPath: publishPath,
            verbose: options.verbose
          },
          (err, packagedServerScriptInfo) => {
            if (err) {
              return cb(err);
            }

            component.oc.files.dataProvider = packagedServerScriptInfo;
            delete component.oc.files.data;
            cb(err, component);
          }
        );
      },
      function(component, cb) {
        // Packaging package.json

        component.oc.version = ocInfo.version;
        component.oc.packaged = true;
        component.oc.date = getUnixUtcTimestamp();

        if (!component.oc.files.static) {
          component.oc.files.static = [];
        }

        if (!_.isArray(component.oc.files.static)) {
          component.oc.files.static = [component.oc.files.static];
        }

        fs.writeJson(path.join(publishPath, 'package.json'), component, err => {
          cb(err, component);
        });
      },
      function(component, cb) {
        // Packaging static files
        packageStaticFiles(
          {
            componentPath: componentPath,
            publishPath: publishPath,
            minify: minify,
            ocOptions: component.oc
          },
          err => cb(err, component)
        );
      }
    ],
    callback
  );
};
