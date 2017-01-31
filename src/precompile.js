const jade = require('jade');
const assign = require('lodash.assign');

const defaults = {
  compileDebug: false,
  name: 't'
};

module.exports = (template, options) => {
  const opts = assign({}, defaults, options);
  return jade.compileClient(template, opts)
    .toString()
    .replace('function t(locals) {', 'function(locals){');
};
