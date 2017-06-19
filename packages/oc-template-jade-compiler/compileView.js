'use strict';

const fs = require('fs-extra');
const path = require('path');
const uglifyJs = require('uglify-js');
const jade = require('jade-legacy');
const hashBuilder = require('oc-hash-builder');
const ocViewWrapper = require('oc-view-wrapper');
const strings = require('./resources/strings');

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  const viewPath = path.join(options.componentPath, viewFileName);
  const viewContent = fs.readFileSync(viewPath);
  const publishPath = options.publishPath;
  const publishFileName = 'template.js'; // Change this to view?

  if (!fs.existsSync(viewPath)) {
    return callback(format(strings.errors.VIEW_NOT_FOUND, viewFileName));
  }

  try {
    const view = jade
      .compileClient(viewContent, {
        compileDebug: false,
        name: 't',
        filename: viewFileName
      })
      .toString()
      .replace('function t(locals) {', 'function(locals){');

    const viewHash = hashBuilder.fromString(view);
    const compiledView = uglifyJs.minify(
      ocViewWrapper(viewHash, view.toString()),
      {
        fromString: true // NOTE: uglify-3 doesn't support this anymore.
      }
    ).code;

    fs.writeFile(path.join(publishPath, publishFileName), compiledView, err =>
      callback(err, {
        type: options.componentPackage.oc.files.template.type,
        hashKey: viewHash,
        src: publishFileName
      })
    );
  } catch (error) {
    return callback(
      format(strings.errors.COMPILATION_FAILED, viewFileName, error)
    );
  }
};
