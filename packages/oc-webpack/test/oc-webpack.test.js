jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

('use strict');

const path = require('path');
const api = require('../index.js');
const webpackConfigurator = require('../lib/configurator');
const webpackCompiler = require('../lib/compiler');

test('module APIs', () => {
  expect(api).toMatchSnapshot();
});

test('webpack configurator', () => {
  const config = webpackConfigurator({
    stats: 'errors-only',
    dependencies: {},
    publishFileName: 'server.js',
    serverPath: '/path/to/server.js'
  });

  // clean paths
  const target = config.module.rules[0].use;
  target[0].loader = path.relative(__dirname, target[0].loader);
  target[1].loader = path.relative(__dirname, target[1].loader);
  target[1].options.presets[0][0] = path.relative(
    __dirname,
    target[1].options.presets[0][0]
  );
  expect(config).toMatchSnapshot();
});

test('webpack compiler', done => {
  const config = webpackConfigurator({
    stats: 'errors-only',
    dependencies: {},
    publishFileName: 'server.js',
    serverPath: path.join(
      __dirname,
      '../../../mocks/jade-component',
      'server.js'
    )
  });
  webpackCompiler(config, (warning, serverContentBundled) => {
    expect(serverContentBundled).toMatchSnapshot();
    done();
  });
});
