const { getInfo } = require('../index.js');
const semverValidator =
  /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b/gi;

test('should return the correct info', () => {
  const info = getInfo();
  expect(semverValidator.test(info.version)).toBe(true);
  delete info.version;
  expect(info).toMatchSnapshot();
});
