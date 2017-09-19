const createCompile = require('../lib/createCompile');

const compileStatics = jest.fn((options, cb) => cb());
const compileView = jest.fn((options, cb) =>
  cb(null, { template: { version: 'x' } })
);
const compileServer = jest.fn((options, cb) => cb(null, {}));
const getInfo = jest.fn(() => ({ version: '6.6.6' }));
jest.mock('fs-extra', () => ({
  writeJson: jest.fn((path, content, cb) => {
    cb(null, content);
  })
}));

afterEach(() => {
  jest.clearAllMocks();
});

test('Correctly create a compiler function', () => {
  const compiler = createCompile({
    compileServer,
    compileView,
    compileStatics,
    getInfo
  });

  expect(compiler).toBeInstanceOf(Function);
  expect(compiler.length).toBe(2);
});

test('If a data-provider is given, the compiler function invokes all sub-compilers', done => {
  const compiler = createCompile({
    compileServer,
    compileView,
    compileStatics,
    getInfo
  });
  const options = {
    componentPath: 'componentPath',
    logger: 'logger',
    minify: 'minify',
    ocPackage: { version: '1.0.0' },
    publishPath: 'publishPath',
    verbose: 'verbose',
    watch: 'watch',
    production: 'prdoduction',
    componentPackage: {
      oc: {
        files: {
          data: 'server.js',
          template: { version: '0.0.1' }
        }
      }
    }
  };

  compiler(options, result => {
    expect(compileView.mock.calls[0][0]).toBe(options);
    expect(compileView).toBeCalled();
    expect(getInfo).toBeCalled();
    expect(compileServer).toBeCalled();
    expect(compileServer.mock.calls[0][0]).toEqual({
      compiledViewInfo: { template: { version: '6.6.6' } },
      componentPackage: {
        oc: { files: { data: 'server.js', template: { version: '0.0.1' } } }
      },
      componentPath: 'componentPath',
      logger: 'logger',
      minify: 'minify',
      ocPackage: { version: '1.0.0' },
      production: 'prdoduction',
      publishPath: 'publishPath',
      verbose: 'verbose',
      watch: 'watch'
    });
    expect(compileStatics).toBeCalled();
    expect(compileStatics.mock.calls[0][0]).toEqual({
      componentPackage: {
        oc: { files: { data: 'server.js', template: { version: '0.0.1' } } }
      },
      componentPath: 'componentPath',
      logger: 'logger',
      minify: 'minify',
      ocPackage: { version: '1.0.0' },
      production: 'prdoduction',
      publishPath: 'publishPath',
      verbose: 'verbose',
      watch: 'watch'
    });
    done();
  });
});

test('If a data-provider is not given, the compiler function invokes all sub-compilers apart the server compiler', done => {
  const compiler = createCompile({
    compileServer,
    compileView,
    compileStatics,
    getInfo
  });
  const options = {
    componentPath: 'componentPath',
    logger: 'logger',
    minify: 'minify',
    ocPackage: { version: '1.0.0' },
    publishPath: 'publishPath',
    verbose: 'verbose',
    watch: 'watch',
    production: 'prdoduction',
    componentPackage: {
      oc: {
        files: {
          template: { version: '0.0.1' }
        }
      }
    }
  };

  compiler(options, result => {
    expect(compileView.mock.calls[0][0]).toBe(options);
    expect(compileView).toBeCalled();
    expect(getInfo).toBeCalled();
    expect(compileServer).not.toBeCalled();
    expect(compileStatics).toBeCalled();
    expect(compileStatics.mock.calls[0][0]).toEqual({
      componentPackage: { oc: { files: { template: { version: '0.0.1' } } } },
      componentPath: 'componentPath',
      logger: 'logger',
      minify: 'minify',
      ocPackage: { version: '1.0.0' },
      production: 'prdoduction',
      publishPath: 'publishPath',
      verbose: 'verbose',
      watch: 'watch'
    });
    done();
  });
});
