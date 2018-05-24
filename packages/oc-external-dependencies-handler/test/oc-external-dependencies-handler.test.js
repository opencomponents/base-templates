const externalDependenciesHandler = require('../index.js');

test('The handler API once instiantated', () => {
  const handler = externalDependenciesHandler({});
  expect(handler.length).toBe(2);
});

test('When a module is being used withough being declared in the package', done => {
  const handler = externalDependenciesHandler({});
  const handlerFunction = handler[0];
  expect(handlerFunction).toBeInstanceOf(Function);
  handlerFunction(null, 'lodash', err => {
    expect(err).toMatchSnapshot();
    done();
  });
});

test('When a module/path is being used withough being declared in the package', done => {
  const handler = externalDependenciesHandler({});
  const handlerFunction = handler[0];
  expect(handlerFunction).toBeInstanceOf(Function);
  handlerFunction(null, 'lodash/package.json', err => {
    expect(err).toMatchSnapshot();
    done();
  });
});

test('When a module declared in the package is being used', done => {
  const handler = externalDependenciesHandler({
    dependencies: { lodash: '4.17.4' }
  });
  const handlerFunction = handler[0];
  handlerFunction(null, 'lodash', err => {
    expect(err).toBeUndefined();
    done();
  });
});

test('When a module is a node core dependency', done => {
  const handler = externalDependenciesHandler({});
  const handlerFunction = handler[0];
  handlerFunction(null, 'url', err => {
    expect(err).toBeUndefined();
    done();
  });
});

test('The handler matcher should correctly match aganinst valid modules', () => {
  const handler = externalDependenciesHandler({
    dependencies: { lodash: '4.17.4' }
  });
  const handlerMatcher = handler[1];
  expect(handlerMatcher).toBeInstanceOf(RegExp);
  expect(handlerMatcher.test('lodash')).toBe(true);
  expect(handlerMatcher.test('lodash/package')).toBe(true);
  expect(handlerMatcher.test('lodash/package.json')).toBe(true);
  expect(handlerMatcher.test('yet-another-module')).toBe(true);
  expect(handlerMatcher.test('@org/module-name')).toBe(true);
  expect(handlerMatcher.test('@org/module/path')).toBe(true);
});

test('The handler matcher should correctly match aganinst not valid modules', () => {
  const handler = externalDependenciesHandler({
    dependencies: { lodash: '4.17.4' }
  });
  const handlerMatcher = handler[1];
  expect(handlerMatcher).toBeInstanceOf(RegExp);
  expect(handlerMatcher.test('/myModule')).toBe(false);
  expect(handlerMatcher.test('./myModule')).toBe(false);
  expect(handlerMatcher.test('./myModule.json')).toBe(false);
  expect(handlerMatcher.test('./myModule.js')).toBe(false);
});
