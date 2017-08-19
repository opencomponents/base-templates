const getInfo = require('../lib/getInfo');
const packageJson = {
  name: 'oc-template-generic',
  version: '1.0.0',
  externals: {
    'lib-one': {
      global: 'LibOne',
      url: 'https://cdn.com/lib-one/1.0.0/lib-one.min.js'
    },
    'lib-two': {
      global: 'LibTwo',
      url: 'https://cdn.com/lib-two/1.0.0/lib-two.min.js'
    }
  }
};

test('should return the correct info', () => {
  const info = getInfo(packageJson);
  expect(info).toMatchSnapshot();
});
