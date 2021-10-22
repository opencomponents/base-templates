jest.setTimeout(100000);

const path = require('path');
const compile = require('../lib/compile.js');
const fs = require('fs-extra');
const nodeDir = require('node-dir');

const componentPackage = require('../../../mocks/es6-component/package.json');
const componentPath = path.join(__dirname, '../../../mocks/es6-component/');
const getInfo = require('../index.js').getInfo;
const publishPath = path.join(componentPath, '__package');

test('Should correctly compile the oc component', done => {
  const options = {
    componentPackage,
    ocPackage: {
      version: '1.0.0'
    },
    componentPath,
    publishPath,
    production: true
  };
  fs.ensureDirSync(publishPath);
  compile(options, (err, res) => {
    expect(err).toBeNull();
    const version = res.oc.files.template.version;
    res.oc.files.template.version = '';
    res.oc.date = '';
    res.oc.files.dataProvider.hashKey = 'dummyData';
    res.oc.files.template.hashKey = 'dummyData';
    expect(res).toMatchSnapshot();
    expect(version).toBe(getInfo().version);
    nodeDir.paths(publishPath, (err, res) => {
      const files = res.files
        .map(filePath => path.relative(__dirname, filePath).replace(/\\/g, '/'))
        .sort();
      expect(files).toMatchSnapshot();
      fs.emptyDirSync(publishPath);
      done();
    });
  });
});
