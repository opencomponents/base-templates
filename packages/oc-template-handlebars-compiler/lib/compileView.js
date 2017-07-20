'use strict';

const fs = require('fs-extra');
const hashBuilder = require('oc-hash-builder');
const handlebars = require('handlebars');
const ocViewWrapper = require('oc-view-wrapper');
const path = require('path');
const uglifyJs = require('uglify-js');

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  const viewPath = path.join(options.componentPath, viewFileName);
  const publishPath = options.publishPath;
  const publishFileName = options.publishFileName || 'template.js';

  fs.readFile(viewPath, 'UTF8', (err, viewContent) => {
    if (err) {
      return callback(`file ${viewFileName} not found`);
    }

    let compiledView, viewHash;

    try {
      const view = handlebars.precompile(viewContent);
      viewHash = hashBuilder.fromString(view);
      compiledView = uglifyJs.minify(ocViewWrapper(viewHash, view.toString()), {
        fromString: true // NOTE: uglify-3 doesn't support this anymore.
      }).code;
    } catch (error) {
      return callback(`${viewFileName} compilation failed - ${error}`);
    }

    fs.ensureDir(publishPath, error => {
      if (error) {
        return callback(`${viewFileName} compilation failed - ${error}`);
      }

      fs.writeFile(path.join(publishPath, publishFileName), compiledView, err =>
        callback(err, {
          type: options.componentPackage.oc.files.template.type,
          hashKey: viewHash,
          src: publishFileName
        })
      );
    });
  });
};
