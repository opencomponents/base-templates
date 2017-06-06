const template = require('../packages/oc-template-jade');
const compiler = require('../packages/oc-template-jade-compiler');

describe('template APIs', () => {
  test('should expose the correct methods', () => {
    expect(template).toMatchSnapshot();
  });
});

describe('template-compiler APIs', () => {
  test('should expose the correct methods', () => {
    expect(compiler).toMatchSnapshot();
  });
});
