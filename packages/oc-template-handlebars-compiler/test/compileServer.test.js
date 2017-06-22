jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

const path = require('path');
const fs = require('fs-extra');
const compileServer = require('../lib/compileServer.js');

const componentPath = path.join(
  __dirname,
  '../../../mocks/handlebars-component'
);
const publishPath = path.join(componentPath, '_package');
const publishFileName = 'server.js';

const options = {
  componentPackage: {
    oc: {
      files: {
        data: 'server.js'
      }
    }
  },
  componentPath,
  publishPath,
  publishFileName
};

test('Should correctly compile the server', done => {
  // fs.ensureDirSync(publishPath);
  compileServer(options, (err, compiledServerInfo) => {
    expect(compiledServerInfo).toMatchSnapshot();
    expect(
      fs.readFileSync(path.join(publishPath, publishFileName), 'UTF8')
    ).toMatchSnapshot();
    fs.removeSync(path.join(publishPath, publishFileName));
    done();
  });
});
