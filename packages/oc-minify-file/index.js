'use strict';

const babel = require('babel-core');
const babelPresetEnv = require('babel-preset-env');
const CleanCss = require('clean-css');
const strings = require('oc-templates-messages');
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

    return uglifyJs.minify(es5TranspiledContent).code;
  } else if (fileExtension === '.css') {
    const result = new CleanCss().minify(fileContent);

    if (result.warnings.length > 0 || result.errors.lenght > 0) {
      throw new Error(strings.errors.cssNotValid());
    }

    return result.styles;
  }
};
