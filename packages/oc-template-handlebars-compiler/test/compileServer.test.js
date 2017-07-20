jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const _ = require('lodash');
const compileServer = require('../lib/compileServer.js');
const fs = require('fs-extra');
const path = require('path');

const componentPath = path.join(
  __dirname,
  '../../../mocks/handlebars-component'
);
const publishPath = path.join(componentPath, '_compile-server-package');
const publishFileName = 'server.js';

const options = {
  componentPackage: fs.readJSONSync(componentPath + '/package.json'),
  componentPath,
  publishPath,
  publishFileName
};

test('Should correctly compile the server', done => {
  compileServer(options, (err, compiledServerInfo) => {
    expect(err).toBeNull();
    expect(compiledServerInfo).toMatchSnapshot();
    expect(
      fs.readFileSync(path.join(publishPath, publishFileName), 'UTF8')
    ).toMatchSnapshot();
    fs.removeSync(path.join(publishPath, publishFileName));
    done();
  });
});

test('When the server.js compilation fails should return error', done => {
  const options2 = _.cloneDeep(options);
  options2.componentPackage.oc.files.data = 'not-found.js';

  compileServer(options2, err => {
    expect(err).toContain('Entry module not found');
    done();
  });
});

test('When server writing fails should return error', done => {
  const original = fs.ensureDir;
  fs.ensureDir = jest.fn((a, cb) => cb('sorry I failed'));

  compileServer(options, err => {
    expect(err).toMatchSnapshot();
    fs.ensureDir = original;
    done();
  });
});
