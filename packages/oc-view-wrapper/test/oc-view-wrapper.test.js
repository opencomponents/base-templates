const viewWrapper = require('../index.js');

test('Wrapping a view function without overriding the OC namespace', () => {
  content = 'function doSomething(someParams){return "someValue"}';
  expect(viewWrapper('123456789', content)).toMatchSnapshot();
});

test('Wrapping a view function with a different namespace', () => {
  namespace = 'MAGIC';
  content = 'function doSomething(someParams){return "someValue"}';
  expect(viewWrapper('123456789', content, namespace)).toMatchSnapshot();
});
