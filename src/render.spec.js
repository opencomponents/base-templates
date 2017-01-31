const render = require('./render');

const template = '<div>Hello</div>';
const precompiledTemplate = jest.fn(() => '<div>Hello</div>');
const options = {
  model: 'aModel',
  template: precompiledTemplate
};
const callback = jest.fn();

describe('render method', () => {
  describe('when invoked with a template', () => {
    render(options, callback);

    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(null, template);
    });
  });
});
