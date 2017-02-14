const path = require('path');
const jade = require('jade');
const compile = require('./compile');

describe('compile method', () => {
  describe('when invoking the method', () => {
    const template = 'Hello';
    const options = {
      viewPath: path.resolve(__dirname)
    };
    compile(template, options);

    test('should correctly invoke jade compileClient method', () => {
      expect(jade.compileClient).toBeCalledWith(template, {
        compileDebug: false,
        filename: path.resolve(__dirname),
        name: 't'
      });
    });
  });
});
