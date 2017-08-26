'use strict';

const _ = require('lodash');
const async = require('async');
const fs = require('fs-extra');
const minifyFile = require('oc-minify-file');
const nodeDir = require('node-dir');
const path = require('path');
const strings = require('oc-templates-messages');

module.exports = (options, callback) => {
  let staticDirectories = options.componentPackage.oc.files.static || [];

  if (staticDirectories.length === 0) {
    return callback(null, 'ok');
  }

  if (!Array.isArray(staticDirectories)) {
    staticDirectories = [staticDirectories];
  }

  async.eachSeries(
    staticDirectories,
    copyDirectory.bind(null, options),
    error => {
      if (error) {
        return callback(error);
      }
      callback(null, 'ok');
    }
  );
};

function copyDirectory(options, directoryName, callback) {
  const directoryPath = path.join(options.componentPath, directoryName);
  fs.lstat(directoryPath, (err, stats) => {
    if (err) {
      return callback(strings.errors.folderNotFound(directoryPath));
    }

    if (!stats.isDirectory()) {
      return callback(strings.errors.folderNotValid(directoryPath));
    }

    nodeDir.paths(directoryPath, (err, res) => {
      async.each(
        res.files,
        (filePath, next) => {
          const fileName = path.basename(filePath);
          const fileExtension = path.extname(filePath).toLowerCase();
          const fileRelativePath = path.relative(
            directoryPath,
            path.dirname(filePath)
          );
          const fileDestinationPath = path.join(
            options.publishPath,
            directoryName,
            fileRelativePath
          );

          fs.ensureDir(fileDestinationPath, err => {
            if (err) {
              return next(err);
            }

            const fileDestination = path.join(fileDestinationPath, fileName);

            if (
              options.minify &&
              options.componentPackage.minify !== false &&
              (fileExtension === '.js' || fileExtension === '.css')
            ) {
              async.waterfall(
                [
                  cb => fs.readFile(filePath, cb),
                  (fileContent, cb) => {
                    const minifiedContent = minifyFile(
                      fileExtension,
                      fileContent
                    );
                    fs.writeFile(fileDestination, minifiedContent, cb);
                  }
                ],
                next
              );
            } else {
              fs.copy(filePath, fileDestination, next);
            }
          });
        },
        err => callback(err, 'ok')
      );
    });
  });
}
