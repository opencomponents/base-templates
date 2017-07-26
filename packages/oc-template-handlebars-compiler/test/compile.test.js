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

const package2 = _.cloneDeep(componentPackage);
const package3 = _.cloneDeep(componentPackage);
const package4 = _.cloneDeep(componentPackage);
delete package2.oc.files.static;
package3.oc.files.static = 'assets';
delete package4.oc.files.data;

const scenarios = {
  'Happy path': {
    componentPackage,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath: path.join(componentPath, '_compile-tests-package')
  },
  'Should handle empty static folder': {
    componentPackage: package2,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath: path.join(componentPath, '_compile-tests-package2')
  },
  'Should normalise stringified static folder': {
    componentPackage: package3,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath: path.join(componentPath, '_compile-tests-package3')
  },
  'Should handle server.js-less components': {
    componentPackage: package4,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath: path.join(componentPath, '_compile-tests-package4')
  }
};

const execute = (options, cb) => {
  compile(options, (err, result) => {
    if (err) {
      return fs.remove(options.publishPath, () => cb(err));
    }

    result.oc.date = '';
    result.oc.files.template.version = '';
    nodeDir.paths(options.publishPath, (err2, res2) => {
      const files = res2.files
        .map(filePath => path.relative(__dirname, filePath))
        .sort();
      fs.remove(options.publishPath, () => cb(err, { result, files }));
    });
  });
};

_.each(scenarios, (scenario, testName) => {
  test(testName, done => {
    execute(scenario, (err, { result, files }) => {
      expect(err).toBeNull();
      expect(result).toMatchSnapshot();
      expect(files).toMatchSnapshot();
      done();
    });
  });
});

test('When server compilation fails should return an error', done => {
  const package5 = _.cloneDeep(componentPackage);
  package5.oc.files.data = 'not-found.js';

  const options = {
    componentPackage: package5,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath: path.join(componentPath, '_compile-tests-package5')
  };

  execute(options, err => {
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

  execute(options, err => {
    expect(err).toMatchSnapshot();
    fs.ensureDir = original;
    done();
  });
});
