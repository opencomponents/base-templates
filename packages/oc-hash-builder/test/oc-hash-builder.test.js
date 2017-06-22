const hashBuilder = require('../index.js');

test('Correctly generate hash out of strings', () => {
  const string = `
    const myName = 'Nick';
    const say = something => console.log(something);
    say(myName);
  `;
  expect(hashBuilder.fromString(string)).toMatchSnapshot();
});
