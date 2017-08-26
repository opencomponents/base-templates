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

  const compile = (viewContent, cb) => {
    try {
      const preCompiledView = handlebars.precompile(viewContent);
      const hash = hashBuilder.fromString(preCompiledView);
      const view = uglifyJs.minify(
        ocViewWrapper(hash, preCompiledView.toString()),
        {
          fromString: true // NOTE: uglify-3 doesn't support this anymore.
        }
      ).code;
      cb(null, { view, hash });
    } catch (err) {
      cb(err);
    }
  };

  async.waterfall(
    [
      next =>
        fs.readFile(viewPath, 'UTF-8', (err, viewContent) =>
          next(err ? 'not found' : null, viewContent)
        ),
      (viewContent, next) => compile(viewContent, next),
      (compiled, next) => fs.ensureDir(publishPath, err => next(err, compiled)),
      (compiled, next) =>
        fs.writeFile(
          path.join(publishPath, publishFileName),
          compiled.view,
          err => next(err, compiled)
        )
    ],
    (err, compiled) => {
      if (err === 'not found') {
        return callback(strings.errors.viewNotFound(viewFileName));
      } else if (err) {
        return callback(strings.errors.compilationFailed(viewFileName, err));
      }
      callback(null, {
        template: {
          type: options.componentPackage.oc.files.template.type,
          hashKey: compiled.hash,
          src: publishFileName
        }
      });
    }
  );
};
