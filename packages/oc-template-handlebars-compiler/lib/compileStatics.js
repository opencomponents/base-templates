'use strict';

const _ = require('lodash');
const async = require('async');
const fs = require('fs-extra');
const minifyFile = require('oc-minify-file');
const nodeDir = require('node-dir');
const path = require('path');

module.exports = (options, callback) => {
  const staticDirectories = options.componentPackage.oc.files.static || [];

  if (staticDirectories.length === 0) {
    return callback(null, 'ok');
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
      return callback(`"${directoryPath}" not found`);
    }

    if (!stats.isDirectory()) {
      return callback(`"${directoryPath}" must be a directory`);
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
              fs.readFile(filePath, (err, fileContent) => {
                if (err) {
                  return next(err);
                }

                const minifiedContent = minifyFile(fileExtension, fileContent);
                fs.writeFile(fileDestination, minifiedContent, next);
              });
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
