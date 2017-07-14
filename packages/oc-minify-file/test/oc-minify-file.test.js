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

test('Minify valid css file', () => {
  const content = `body {
    background-color: #FFFFFF;
  }`;

  expect(minifyFile('.css', content)).toMatchSnapshot();
});

test('Minify not valid css', () => {
  const content = `var a = notACss;`;
  expect(() => minifyFile('.css', content)).toThrowErrorMatchingSnapshot();
});
