const path = require('path');
const jade = require('jade-legacy');
const compile = require('../packages/oc-template-jade-compiler/compile');

describe('compile method', () => {
  describe('when invoking the method', () => {
    const template = 'Hello';
    const viewPath = path.resolve(__dirname);

    test('should correctly invoke jade compileClient method', (done) => {
      compile({ template, viewPath }, () => {
        expect(jade.compileClient).toBeCalledWith(template, {
          compileDebug: false,
          filename: path.resolve(__dirname),
          name: 't'
        });
        done();
      });
    });
  });
});
