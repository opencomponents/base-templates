'use strict';

const babel = require('babel-core');
const babelPresetEnv = require('babel-preset-env');
const CleanCss = require('clean-css');
const uglifyJs = require('uglify-js');

module.exports = function(fileExtension, fileContent) {
  if (fileExtension === '.js') {
    const presetOptions = {
      targets: {
        browsers: 'ie 8',
        uglify: true
      },
      useBuiltIns: true,
      modules: false
    };

    const babelOptions = { presets: [[babelPresetEnv, presetOptions]] };
    const es5TranspiledContent = babel.transform(fileContent, babelOptions)
      .code;

    return uglifyJs.minify(es5TranspiledContent, { fromString: true }).code;
  } else if (fileExtension === '.css') {
    return new CleanCss().minify(fileContent).styles;
  }
};
