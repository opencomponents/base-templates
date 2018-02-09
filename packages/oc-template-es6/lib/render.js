'use strict';
const es6Renderer = require('express-es6-template-engine');

module.exports = (options, callback) => {
  try {
    const html = es6Renderer(options.template, {
      template: true,
      locals: options.model
    });
    return callback(null, html);
  } catch (error) {
    return callback(error);
  }
};
