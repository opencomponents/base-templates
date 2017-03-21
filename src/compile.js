/* eslint-disable no-var */

const jade = require('jade');

module.exports = (options, callback) => {
  var compiled;
  try {
    compiled = jade.compileClient(options.template, {
      compileDebug: false,
      name: 't',
      filename: options.viewPath
    })
    .toString()
    .replace('function t(locals) {', 'function(locals){');
  } catch (err) {
    return callback(err);
  }
  return callback(null, compiled);
};
