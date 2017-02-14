const vm = require('vm');
const jade = require('jade/runtime.js');

module.exports = (templateString, key) => {
  const context = { jade };
  vm.runInNewContext(templateString, context);
  return context.oc.components[key];
};
