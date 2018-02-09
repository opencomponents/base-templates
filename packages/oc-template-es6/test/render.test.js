const { render } = require('../index.js');

describe('render method', () => {
  describe('when invoked with a valid template', () => {
    const model = { templateType: 'es6', place: 'multiverse' };
    const template =
      '${templateType.toUpperCase()} - The fastest oc template in the whole ${place}!';
    const callback = jest.fn();

    render({ model, template }, callback);
    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(
        null,
        'ES6 - The fastest oc template in the whole multiverse!'
      );
    });
  });

  describe('when invoked with a broken view-model that throws an exception', () => {
    const model = {};
    const template = "${throw new Error('blargh)}";
    const callback = jest.fn();

    render({ model, template }, callback);
    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(
        new SyntaxError('Unexpected token throw')
      );
    });
  });
});
