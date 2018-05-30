'use strict';

const async = require('async');
const fs = require('fs-extra');
const hashBuilder = require('oc-hash-builder');
const ocViewWrapper = require('oc-view-wrapper');
const path = require('path');
const strings = require('oc-templates-messages');
const MemoryFS = require('memory-fs');
const minifyFile = require('oc-minify-file');
const viewTemplate = require('./viewTemplate');
const fontFamilyUnicodeParser = require('./to-abstract-base-template-utils/font-family-unicode-parser');
const {
  compiler,
  configurator: webpackConfigurator
} = require('./to-abstract-base-template-utils/oc-webpack');

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  const viewPath = path.join(options.componentPath, viewFileName);
  const viewContent = fs.readFileSync(viewPath, 'UTF8');
  const publishPath = options.publishPath;
  const publishFileName = options.publishFileName || 'template.js';
  const production = options.production;

  if (!fs.existsSync(viewPath)) {
    return callback(strings.errors.viewNotFound(viewFileName));
  }

  const config = webpackConfigurator({
    viewPath,
    publishFileName,
    production,
    buildIncludes:
      options.componentPackage.oc.files.template.buildIncludes || []
  });

  const compile = (config, cb) => {
    compiler(config, (err, data) => {
      if (err) {
        return callback(err);
      }
      const memoryFs = new MemoryFS(data);
      const bundle = memoryFs.readFileSync(
        `/build/${config.output.filename}`,
        'UTF8'
      );

      let css = null;
      if (data.build['main.css']) {
        // This is an awesome hack by KimTaro that will blow your mind.
        // Remove it once this get merged: https://github.com/webpack-contrib/css-loader/pull/523
        css = fontFamilyUnicodeParser(
          memoryFs.readFileSync(`/build/main.css`, 'UTF8')
        );
        // TODO: something seems to brake when "" in jess for japanese ^^
        // We convert single quotes to double quotes in order to
        // support the viewTemplate's string interpolation
        css = minifyFile('.css', css).replace(/\'/g, '"');

        const cssPath = path.join(publishPath, `styles.css`);
        fs.outputFileSync(cssPath, css);
      }

      const templateString = viewTemplate({
        css,
        bundle
      });

      const templateStringCompressed = production
        ? templateString.replace(/\s+/g, ' ')
        : templateString;
      const hash = hashBuilder.fromString(templateStringCompressed);
      const view = ocViewWrapper(hash, templateStringCompressed);

      return cb(null, {
        template: { view, hash }
      });
    });
  };

  async.waterfall(
    [
      next => compile(config, next),
      (compiled, next) => fs.ensureDir(publishPath, err => next(err, compiled)),
      (compiled, next) =>
        fs.writeFile(
          path.join(publishPath, publishFileName),
          compiled.template.view,
          err => next(err, compiled)
        )
    ],
    (err, compiled) => {
      if (err) {
        return callback(strings.errors.compilationFailed(viewFileName, err));
      }
      callback(null, {
        template: {
          type: options.componentPackage.oc.files.template.type,
          hashKey: compiled.template.hash,
          src: publishFileName
        }
      });
    }
  );
};
