const { getInfo } = require('../index.js');

const currentVersion = require('../package.json').dependencies.handlebars;

test('should return the correct info', () => {
  const info = getInfo();

  info.externals.forEach(external => {
    if (external.name === 'handlebars')
      external.url = external.url.replace(currentVersion, '6.6.6');
  });
  delete info.version;

  expect(info).toMatchSnapshot();
});
