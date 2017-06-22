const render = require('../lib/render');

describe('render method', () => {
  describe('when invoked with a valid template', () => {
    const model = { aModel: true };
    const template = {
      compiler: [7, '>= 4.0.0'],
      main: function() {
        return 'Hello world!';
      },
      useData: !0
    };
    const callback = jest.fn();

    render({ model, template }, callback);
    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(null, 'Hello world!');
    });
  });

  describe('when invoked with a broken view-model that throws an exception', () => {
    const model = { aModel: true };
    const template = {
      compiler: [7, '>= 4.0.0'],
      main: function() {
        throw new Error('blargh');
      },
      useData: !0
    };
    const callback = jest.fn();

    render({ model, template }, callback);
    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(new Error('blargh'));
    });
  });
});
