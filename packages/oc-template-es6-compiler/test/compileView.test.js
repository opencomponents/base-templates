jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const path = require('path');
const fs = require('fs-extra');
const compileView = require('../lib/compileView.js');
const _ = require('lodash');

const componentPath = path.join(__dirname, '../../../mocks/es6-component');
const publishPath = path.join(componentPath, '_package');
const componentPackage = require(`${componentPath}/package.json`);
const publishFileName = 'template.js';

const options = {
  componentPackage,
  componentPath,
  publishPath,
  publishFileName
};

test('Should correctly compile the view', done => {
  compileView(options, (err, compiledViewInfo) => {
    expect(compiledViewInfo).toMatchSnapshot();
    expect(
      fs.readFileSync(path.join(publishPath, publishFileName), 'UTF8')
    ).toMatchSnapshot();
    fs.removeSync(path.join(publishPath, publishFileName));
    done();
  });
});
