'use strict';

const fs = require('fs-extra');
const hashBuilder = require('oc-hash-builder');
const jade = require('jade-legacy');
const ocViewWrapper = require('oc-view-wrapper');
const path = require('path');
const strings = require('oc-templates-messages');
const uglifyJs = require('uglify-js');

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  const viewPath = path.join(options.componentPath, viewFileName);
  const viewContent = fs.readFileSync(viewPath, 'UTF8');
  const publishPath = options.publishPath;
  const publishFileName = options.publishFileName || 'template.js';

  if (!fs.existsSync(viewPath)) {
    return callback(strings.errors.viewNotFound(viewFileName));
  }

  try {
    const view = jade
      .compileClient(viewContent, {
        compileDebug: false,
        name: 't',
        filename: viewPath
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

    fs.ensureDirSync(publishPath);
    fs.writeFile(path.join(publishPath, publishFileName), compiledView, err =>
      callback(err, {
        template: {
          type: options.componentPackage.oc.files.template.type,
          hashKey: viewHash,
          src: publishFileName
        }
      })
    );
  } catch (error) {
    return callback(strings.errors.compilationFailed(viewFileName, error));
  }
};
