'use strict';

const async = require('async');
const format = require('stringformat');
const fs = require('fs-extra');
const minifyFile = require('./to-be-published/minify-file');
const nodeDir = require('node-dir');
const path = require('path');
const _ = require('lodash');

const strings = require('./resources/strings');

module.exports = (options, callback) => {
  const staticDirectories = options.componentPackage.files.static;

  if (staticDirectories.length === 0) {
    return callback(null, 'ok');
  }

  async.eachSeries(staticDirectories, copyDirectory, error => {
    if (error) {
      return callback(error);
    }
    callback(null, 'ok');
  });
};

function copyDirectory(staticDirectory, options, callback) {
  const staticDirectoryPath = path.join(options.componentPath, staticDirectory);
  const directoryExists = fs.existsSync(staticDirectoryPath);
  const isDirectory =
    directoryExists && fs.lstatSync(staticDirectoryPath).isDirectory();

  if (!directoryExists) {
    return callback(
      format(strings.errors.FOLDER_NOT_FOUND, staticDirectoryPath)
    );
  }
  if (!isDirectory) {
    return callback(
      format(strings.errors.FOLDER_IS_NOT_A_FOLDER, staticDirectoryPath)
    );
  }

  nodeDir.paths(staticDirectoryPath, (err, res) => {
    _.forEach(res.files, filePath => {
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath).toLowerCase();
      const fileRelativePath = path.relative(
        staticDirectoryPath,
        path.dirname(filePath)
      );
      const fileDestinationPath = path.join(
        options.publishPath,
        staticDirectory,
        fileRelativePath
      );
      fs.ensureDirSync(fileDestinationPath);
      const fileDestination = path.join(fileDestinationPath, fileName);

      if (
        options.minify &&
        options.componentPackage.minify !== false &&
        (fileExtension === '.js' || fileExtension === '.css')
      ) {
        const fileContent = fs.readFileSync(filePath).toString();
        const minifiedContent = minifyFile(fileExtension, fileContent);
        fs.writeFileSync(fileDestination, minifiedContent);
      } else {
        fs.copySync(filePath, fileDestination);
      }
    });
    callback(null, 'ok');
  });
}
