const jade = require('jade');

module.exports = (template, options) => jade.compileClient(template, options);
