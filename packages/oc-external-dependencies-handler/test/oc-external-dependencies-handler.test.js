const externalDependenciesHandler = require('../index.js');

test('When a module is being used withough being declared in the package', done => {
  const handler = externalDependenciesHandler({});
  const handlerFunction = handler[0];
  handlerFunction(null, 'lodash', err => {
    expect(err).toMatchSnapshot();
    done();
  });
});

test('When a module declared in the package is being used', done => {
  const handler = externalDependenciesHandler({ lodash: '4.17.4' });
  const handlerFunction = handler[0];
  handlerFunction(null, 'lodash', err => {
    expect(err).toBeUndefined();
    done();
  });
});

test('The handler matcher should correctly match aganinst valid modules', () => {
  const handler = externalDependenciesHandler({ lodash: '4.17.4' });
  const handlerMatcher = handler[1];
  expect(handlerMatcher.test('lodash')).toBe(true);
  expect(handlerMatcher.test('yet-another-module')).toBe(true);
  expect(handlerMatcher.test('@org/module-name')).toBe(true);
  expect(handlerMatcher.test('@org/module/path')).toBe(true);
});
