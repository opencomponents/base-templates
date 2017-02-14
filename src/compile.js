const jade = require('jade');

module.exports = (template, options) =>
  jade.compileClient(template, {
    compileDebug: false,
    name: 't',
    filename: options.viewPath
  })
  .toString()
  .replace('function t(locals) {', 'function(locals){');

