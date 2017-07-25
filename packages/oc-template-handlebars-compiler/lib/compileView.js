'use strict';

const async = require('async');
const fs = require('fs-extra');
const hashBuilder = require('oc-hash-builder');
const handlebars = require('handlebars');
const ocViewWrapper = require('oc-view-wrapper');
const path = require('path');
const strings = require('oc-templates-messages');
const uglifyJs = require('uglify-js');

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  const viewPath = path.join(options.componentPath, viewFileName);
  const publishPath = options.publishPath;
  const publishFileName = options.publishFileName || 'template.js';

  fs.readFile(viewPath, 'UTF8', (err, viewContent) => {
    if (err) {
      return callback(strings.errors.viewNotFound(viewFileName));
    }

    let compiledView, viewHash;

    async.series(
      [
        next => {
          try {
            const view = handlebars.precompile(viewContent);
            viewHash = hashBuilder.fromString(view);
            compiledView = uglifyJs.minify(
              ocViewWrapper(viewHash, view.toString()),
              {
                fromString: true // NOTE: uglify-3 doesn't support this anymore.
              }
            ).code;
            next();
          } catch (err) {
            next(err);
          }
        },
        next => fs.ensureDir(publishPath, next),
        next =>
          fs.writeFile(
            path.join(publishPath, publishFileName),
            compiledView,
            next
          )
      ],
      err => {
        if (err) {
          return callback(strings.errors.compilationFailed(viewFileName, err));
        }
        callback(null, {
          type: options.componentPackage.oc.files.template.type,
          hashKey: viewHash,
          src: publishFileName
        });
      }
    );
  });
};
