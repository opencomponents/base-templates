const { render } = require('../index.js');

describe('render method', () => {
  describe('when invoked with a valid template', () => {
    const model = { aModel: true };
    const template = () => '<div>Hello</div>';
    const callback = jest.fn();

    render({ model, template }, callback);
    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(null, '<div>Hello</div>');
    });
  });

  describe('when invoked with a broken view-model that throws an exception', () => {
    const model = { aModel: true };
    const template = () => {
      throw new Error('blargh');
    };
    const callback = jest.fn();

    render({ model, template }, callback);
    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(new Error('blargh'));
    });
  });
});
