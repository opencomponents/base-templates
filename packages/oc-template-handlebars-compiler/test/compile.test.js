jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const _ = require('lodash');
const compile = require('../lib/compile.js');
const fs = require('fs-extra');
const nodeDir = require('node-dir');
const path = require('path');

const componentPath = path.join(
  __dirname,
  '../../../mocks/handlebars-component/'
);
const componentPackage = fs.readJsonSync(
  path.join(componentPath, 'package.json')
);

const init = (options, cb) => {
  compile(options, (err, result) => {
    if (err) {
      return fs.emptyDir(options.publishPath, () => cb(err));
    }

    result.oc.date = '';
    nodeDir.paths(options.publishPath, (err2, res2) => {
      const files = res2.files
        .map(filePath => path.relative(__dirname, filePath))
        .sort();
      fs.emptyDir(options.publishPath, () => cb(err, { result, files }));
    });
  });
};

test('Should correctly compile the oc component', done => {
  const options = {
    componentPackage,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath: path.join(componentPath, '_compile-tests-package')
  };

  init(options, (err, { result, files }) => {
    expect(err).toBeNull();
    expect(result).toMatchSnapshot();
    expect(files).toMatchSnapshot();
    done();
  });
});

test('Should handle empty static folder', done => {
  let package2 = _.cloneDeep(componentPackage);
  delete package2.oc.files.static;

  const options = {
    componentPackage: package2,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath: path.join(componentPath, '_compile-tests-package2')
  };

  init(options, (err, { result, files }) => {
    expect(err).toBeNull();
    expect(result).toMatchSnapshot();
    expect(files).toMatchSnapshot();
    done();
  });
});

test('Should normalise stringified static folder', done => {
  let package3 = _.cloneDeep(componentPackage);
  package3.oc.files.static = 'assets';

  const options = {
    componentPackage: package3,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath: path.join(componentPath, '_compile-tests-package3')
  };

  init(options, (err, { result, files }) => {
    expect(err).toBeNull();
    expect(result).toMatchSnapshot();
    expect(files).toMatchSnapshot();
    done();
  });
});

test('Should handle server.js-less components', done => {
  let package4 = _.cloneDeep(componentPackage);
  delete package4.oc.files.data;

  const options = {
    componentPackage: package4,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath: path.join(componentPath, '_compile-tests-package4')
  };

  init(options, (err, { result, files }) => {
    expect(err).toBeNull();
    expect(result).toMatchSnapshot();
    expect(files).toMatchSnapshot();
    done();
  });
});

test('When server compilation fails should return an error', done => {
  let package5 = _.cloneDeep(componentPackage);
  package5.oc.files.data = 'not-found.js';

  const options = {
    componentPackage: package5,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath: path.join(componentPath, '_compile-tests-package5')
  };

  init(options, err => {
    expect(err).toContain('Entry module not found');
    done();
  });
});

test('When files writing fails should return an error', done => {
  const original = fs.ensureDir;
  fs.ensureDir = jest.fn((a, cb) => cb('sorry I failed'));

  const options = {
    componentPackage,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath: path.join(componentPath, '_compile-tests-package6')
  };

  init(options, err => {
    expect(err).toMatchSnapshot();
    fs.ensureDir = original;
    done();
  });
});
