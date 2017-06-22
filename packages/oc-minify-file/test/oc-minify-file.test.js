const minifyFile = require('../index.js');

test('Minify es6 files', () => {
  const content = 'const hi = (name) => `hello ${name}`;';
  const minified = minifyFile('.js', content);
  expect(minifyFile('.js', content)).toMatchSnapshot();
});

test('Minify not valid js', () => {
  const content = 'const a=notvalid(';
  expect(minifyFile.bind(null, '.js', content)).toThrowErrorMatchingSnapshot();
});
