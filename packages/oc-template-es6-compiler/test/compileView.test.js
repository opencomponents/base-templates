jest.setTimeout(50000);

const path = require('path');
const fs = require('fs-extra');
const compileView = require('../lib/compileView.js');

test('valid component', done => {
  const componentPath = path.join(__dirname, '../../../mocks/es6-component');
  const publishPath = path.join(componentPath, '_packageCompileViewTest');
  const publishFileName = 'template.js';

  const options = {
    componentPackage: fs.readJsonSync(`${componentPath}/package.json`),
    componentPath,
    publishPath,
    publishFileName,
    production: true
  };

  compileView(options, (err, compiledViewInfo) => {
    const viewHashKey = compiledViewInfo.template.hashKey;
    compiledViewInfo.template.hashKey = 'dummyData';
    expect(compiledViewInfo).toMatchSnapshot();
    expect(
      fs
        .readFileSync(path.join(publishPath, publishFileName), 'UTF8')
        .replace(viewHashKey, 'dummyData')
    ).toMatchSnapshot();
    fs.removeSync(publishPath);
    done();
  });
});

test('invalid component', done => {
  const componentPath = path.join(__dirname, '../../../mocks/es6-component');
  const publishPath = path.join(componentPath, '_packageCompileViewTest2');
  const publishFileName = 'template.js';
  const componentPackage = fs.readJsonSync(`${componentPath}/package.json`);
  componentPackage.oc.files.template.src = 'broken.js';

  const options = {
    componentPackage,
    componentPath,
    publishPath,
    publishFileName,
    production: true
  };

  compileView(options, (err, compiledViewInfo) => {
    expect(err).toContain('SyntaxError: Unexpected token (2:2)');
    done();
  });
});
