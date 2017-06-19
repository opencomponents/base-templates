const getInfo = require('../getInfo');

test('should return the correct info', () => {
  const info = getInfo();
  delete info.version;
  expect(info).toMatchSnapshot();
});
