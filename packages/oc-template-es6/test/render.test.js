const { render } = require('../index.js');

describe('render method', () => {
  describe('when invoked with a valid template', () => {
    const model = { templateName: 'oc-template-es6', place: 'multiverse' };
    const template = ({ templateName, place }) =>
      `${templateName.toUpperCase()} - The simplest oc template in the whole ${place}!`;
    const callback = jest.fn();

    render({ model, template }, callback);
    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(
        null,
        'OC-TEMPLATE-ES6 - The simplest oc template in the whole multiverse!'
      );
    });
  });

  describe('when invoked with a broken view-model that throws an exception', () => {
    const model = {};
    const template = props => {
      throw new Error('blargh');
    };
    const callback = jest.fn();

    render({ model, template }, callback);
    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(new Error('blargh'));
    });
  });
});
