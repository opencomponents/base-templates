'use strict';

const fs = require('fs-extra');
const path = require('path');
const uglifyJs = require('uglify-js');
const jade = require('jade-legacy');
const hashBuilder = require('./to-be-published/hash-builder');
const ocViewWrapper = require('./to-be-published/oc-view-wrapper');
const strings = require('./resources/strings');

module.exports = (options, callback) => {
  const viewFileName = options.package.oc.files.template.src;
  const viewPath = path.join(options.componentPath, viewFileName);
  const viewContent = fs.readFileSync(viewPath); // why toString?
  const publishPath = path.join(options.componentPath, '_package');
  const publishFileName = 'template.js'; // can we change this to view?

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
    const compiledView = uglifyJs.minify(ocViewWrapper(viewHash, view), {
      fromString: true
    }).code;

    fs.writeFile(path.join(publishPath, publishFileName), compiledView, err =>
      callback(err, {
        type: options.package.files.template.type,
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
