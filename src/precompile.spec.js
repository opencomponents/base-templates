const path = require('path');
const jade = require('jade');
const precompile = require('./precompile');

describe('precompile method', () => {
  describe('when invoking the method', () => {
    const template = 'Hello';
    const options = {
      filename: path.resolve(__dirname),
      compileDebug: false,
      name: 't'
    };
    precompile(template, options);

    test('should correctly invoke handlebars precompile method', () => {
      expect(jade.compileClient).toBeCalledWith(template, options);
    });
  });
});
