const getTimeStamp = require('../index.js');

test('Generates correct timestamps everytime its invoked', () => {
  expect(getTimeStamp()).toBeLessThan(getTimeStamp());
});
