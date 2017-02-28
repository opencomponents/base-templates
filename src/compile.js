const jade = require('jade');

module.exports = (options, callback) =>
  callback(
    jade.compileClient(options.template, {
      compileDebug: false,
      name: 't',
      filename: options.viewPath
    })
    .toString()
    .replace('function t(locals) {', 'function(locals){')
  );

