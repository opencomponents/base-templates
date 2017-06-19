const path = require('path');
const fs = require('fs-extra');
const compileServer = require('../compileServer.js');

const componentPath = path.join(__dirname, '../../../mocks/jadeComponent');
const publishPath = path.join(componentPath, '_package');
const fileName = 'server.js';

const options = {
  componentPackage: {
    oc: {
      files: {
        data: fileName
      }
    }
  },
  componentPath,
  publishPath
};

test('Should correctly compile the server', done => {
  fs.ensureDirSync(publishPath);
  compileServer(options, (err, compiledServerInfo) => {
    expect(compiledServerInfo).toMatchSnapshot();
    expect(
      fs.readFileSync(path.join(publishPath, fileName), 'UTF8')
    ).toMatchSnapshot();
    fs.removeSync(path.join(publishPath, fileName));
    done();
  });
});
