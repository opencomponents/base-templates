const { render } = require('../index.js');

describe('render method', () => {
  describe('when invoked with a valid template', () => {
    const model = { name: 'JavaScript' };
    const template = props => `<div>Hello ${props.name.toUpperCase()}</div>`;
    const callback = jest.fn();

    render({ model, template }, callback);
    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(null, '<div>Hello JAVASCRIPT</div>');
    });
  });

  describe('when invoked with a broken view-model that throws an exception', () => {
    const model = { name: 'JavaScript' };
    const template = props => `<div>Hello ${blargh}</div>`;
    const callback = jest.fn();

    render({ model, template }, callback);
    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(
        new ReferenceError('blargh is not defined')
      );
    });
  });
});
