'use strict';

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
  expect(config).toMatchSnapshot();
});

test('webpack compiler', done => {
  const config = webpackConfigurator({
    stats: 'errors-only',
    dependencies: {},
    publishFileName: 'server.js',
    serverPath: path.join(
      __dirname,
      '../../../mocks/jadeComponent',
      'server.js'
    )
  });
  webpackCompiler(config, (warning, serverContentBundled) => {
    expect(serverContentBundled).toMatchSnapshot();
    done();
  });
});
