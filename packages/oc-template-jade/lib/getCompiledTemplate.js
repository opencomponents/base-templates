const jade = require('jade-legacy/runtime.js');
const vm = require('vm');

module.exports = (templateString, key) => {
  const context = { jade };
  vm.runInNewContext(templateString, context);
  return context.oc.components[key];
};
