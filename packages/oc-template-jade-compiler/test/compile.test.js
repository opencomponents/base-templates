jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const path = require('path');
const compile = require('../lib/compile.js');
const fs = require('fs-extra');
const nodeDir = require('node-dir');

const componentPackage = require('../../../mocks/jade-component/package.json');
const componentPath = path.join(__dirname, '../../../mocks/jade-component/');
const getInfo = require('../index.js').getInfo;
const publishPath = path.join(componentPath, '__package');

test('Should correctly compile the oc component', done => {
  const options = {
    componentPackage,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath
  };
  fs.ensureDirSync(publishPath);
  compile(options, (err, res) => {
    expect(err).toBeNull();
    const version = res.oc.files.template.version;
    res.oc.files.template.version = '';
    res.oc.date = '';
    expect(res).toMatchSnapshot();
    expect(version).toBe(getInfo().version);
    nodeDir.paths(publishPath, (err, res) => {
      const files = res.files
        .map(filePath => path.relative(__dirname, filePath))
        .sort();
      expect(files).toMatchSnapshot();
      fs.emptyDirSync(publishPath);
      done();
    });
  });
});
