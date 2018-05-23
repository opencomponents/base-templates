jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

('use strict');

const path = require('path');
const api = require('../index.js');
const MemoryFS = require('memory-fs');

const {
  compiler: webpackCompiler,
  configurator: webpackConfigurator
} = require('../lib/oc-webpack');

test('module APIs', () => {
  expect(api).toMatchSnapshot();
});

test('webpack configurator with production=false', () => {
  const config = webpackConfigurator({
    stats: 'errors-only',
    dependencies: {},
    production: false,
    publishFileName: 'server.js',
    serverPath: '/path/to/server.js'
  });

  // clean paths
  const target = config.module.rules[0].use;
  target[0].loader = path.relative(__dirname, target[0].loader);
  target[0].options.presets[0][0] = path.relative(
    __dirname,
    target[0].options.presets[0][0]
  );
  target[0].options.plugins[0][0] = path.relative(
    __dirname,
    target[0].options.plugins[0][0]
  );
  delete config.logger;

  expect(config).toMatchSnapshot();
});

test('webpack configurator with production=true', () => {
  const config = webpackConfigurator({
    stats: 'errors-only',
    dependencies: {},
    production: true,
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
  target[1].options.plugins[0][0] = path.relative(
    __dirname,
    target[1].options.plugins[0][0]
  );
  delete config.logger;

  expect(config).toMatchSnapshot();
});

test('webpack compiler', done => {
  const serverPath = path.join(
    __dirname,
    '../../../mocks/jade-component',
    'server.js'
  );

  const dest = path.join(serverPath, '../build/server.js');
  const sourceMapDest = path.join(serverPath, '../build/server.js.map');
  const config = webpackConfigurator({
    stats: 'errors-only',
    dependencies: { lodash: '' },
    production: false,
    publishFileName: 'server.js',
    serverPath
  });

  webpackCompiler(config, (error, data) => {
    const fs = new MemoryFS(data);
    const serverContentBundled = fs.readFileSync(dest, 'UTF8');
    expect(serverContentBundled).toMatchSnapshot();

    const sourceMapContentBundled = fs.readFileSync(sourceMapDest, 'UTF8');
    const sourceMapJson = JSON.parse(sourceMapContentBundled);
    sourceMapJson.sources[1] = '/path/to/component/server.js';
    expect(sourceMapJson).toMatchSnapshot();
    done();
  });
});

test('webpack compiler verbose', done => {
  const serverPath = path.join(
    __dirname,
    '../../../mocks/jade-component',
    'server.js'
  );

  const dest = path.join(serverPath, '../build/server.js');
  const loggerMock = { log: jest.fn() };
  const config = webpackConfigurator({
    logger: loggerMock,
    stats: 'verbose',
    dependencies: { lodash: '' },
    production: true,
    publishFileName: 'server.js',
    serverPath
  });

  webpackCompiler(config, (error, data) => {
    const fs = new MemoryFS(data);
    const serverContentBundled = fs.readFileSync(dest, 'UTF8');
    const consoleOutput = loggerMock.log.mock.calls[0][0];
    expect(serverContentBundled).toMatchSnapshot();
    expect(consoleOutput).toMatch(/Hash:(.*?)a15f6ec5ba078b729780/);
    expect(consoleOutput).toMatch(/Entrypoint(.*?)main(.*?)=(.*?)server.js/);
    expect(consoleOutput).toMatch(/external \"lodash\"/);
    done();
  });
});

test('webpack compiler with fatal error', done => {
  const config = webpackConfigurator({
    stats: 'errors-only',
    dependencies: { lodash: '' },
    publishFileName: 'server.js',
    serverPath: path.join(
      __dirname,
      '../../../mocks/jade-component',
      'server.js'
    )
  });

  config.plugins.push(function() {
    this.plugin('run', (compiler, cb) =>
      cb('This is a fatal compilation error')
    );
  });

  webpackCompiler(config, (error, data) => {
    expect(error).toMatchSnapshot();
    done();
  });
});

test('webpack compiler with soft error', done => {
  const config = webpackConfigurator({
    stats: 'errors-only',
    dependencies: { lodash: '' },
    publishFileName: 'server.js',
    serverPath: path.join(__dirname, 'some/not/valid/path', 'server.js')
  });

  webpackCompiler(config, (error, data) => {
    expect(error).toContain(`Entry module not found: Error: Can't resolve`);
    done();
  });
});

test('webpack compiler with warning', done => {
  const loggerMock = { log: jest.fn() };
  const config = webpackConfigurator({
    logger: loggerMock,
    stats: 'normal',
    dependencies: { lodash: '' },
    publishFileName: 'server.js',
    serverPath: path.join(
      __dirname,
      '../../../mocks/jade-component',
      'server.js'
    )
  });

  config.plugins.push(function() {
    this.plugin('run', (compiler, cb) => cb.call(compiler));
    this.plugin('done', stats => stats.compilation.warnings.push('A warning'));
  });

  webpackCompiler(config, (error, data) => {
    expect(loggerMock.log.mock.calls[0][0]).toContain('A warning');
    expect(error).toBe(null);
    done();
  });
});
