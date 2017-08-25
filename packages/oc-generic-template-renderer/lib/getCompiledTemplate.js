const vm = require('vm');

module.exports = (templateString, key, context) => {
  context = context || {};
  vm.runInNewContext(templateString, context);
  return context.oc.components[key];
};
