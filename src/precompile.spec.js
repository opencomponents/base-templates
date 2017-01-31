const path = require('path');
const jade = require('jade');
const precompile = require('./precompile');

describe('precompile method', () => {
  describe('when invoking the method', () => {
    const template = 'Hello';
    const options = {
      viewPath: path.resolve(__dirname)
    };
    precompile(template, options);

    test('should correctly invoke handlebars precompile method', () => {
      expect(jade.compileClient).toBeCalledWith(template, {
        compileDebug: false,
        filename: path.resolve(__dirname),
        name: 't'
      });
    });
  });
});
