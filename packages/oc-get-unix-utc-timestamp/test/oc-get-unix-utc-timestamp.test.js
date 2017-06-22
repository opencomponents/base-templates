const getTimeStamp = require('../index.js');

test("Generates correct timestamps everytime it's invoked", () => {
  expect(getTimeStamp()).toBeLessThanOrEqual(getTimeStamp());
});
