const emptyResponseHandler = require('../index.js');

test('context decorator called', () => {
  const context = {};
  const callback = jest.fn();
  context.setEmptyResponse = emptyResponseHandler.contextDecorator(callback);

  context.setEmptyResponse();
  expect(callback).toBeCalledWith(null, { __oc_emptyResponse: true });
});

test('context decorator not called', () => {
  const context = {};
  const callback = jest.fn();
  context.setEmptyResponse = emptyResponseHandler.contextDecorator(callback);

  callback(null, { myViewModel: 'test' });
  expect(callback).toBeCalledWith(null, { myViewModel: 'test' });
});

describe('renderer', () => {
  const scenarios = [
    { model: { __oc_emptyResponse: true }, expected: '' },
    { model: { name: 'test' }, expected: '<p>test</p>' },
    { model: { __oc_emptyResponse: false }, expected: '<p></p>' }
  ];

  const template = model => `<p>${model.name || ''}</p>`;

  const render = model => {
    const empty = emptyResponseHandler.shouldRenderAsEmpty(model);
    return empty ? '' : template(model);
  };

  scenarios.forEach(scenario =>
    test(`when model=${JSON.stringify(scenario.model)}`, () => {
      expect(render(scenario.model)).toEqual(scenario.expected);
    })
  );
});
