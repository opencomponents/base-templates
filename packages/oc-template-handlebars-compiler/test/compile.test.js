const path = require('path');
const compile = require('../lib/compile.js');

jest.mock('fs-extra');
jest.mock('../lib/compileServer.js');
jest.mock('../lib/compileView.js');
jest.mock('../lib/compileStatics.js');

const fs = require('fs-extra');
fs.writeJSON.mockImplementation((_path, componentPackage, cb) =>
  cb(null, componentPackage)
);
const compileServer = require(
  '../lib/compileServer.js'
).mockImplementation((options, cb) => cb());
const compileView = require(
  '../lib/compileView.js'
).mockImplementation((options, cb) => cb());
const compileStatics = require(
  '../lib/compileStatics.js'
).mockImplementation((options, cb) => cb());

afterEach(() => {
  compileView.mockClear();
  compileServer.mockClear();
  compileStatics.mockClear();
  fs.writeJSON.mockClear();
});

test('Should correctly invoke the various compilers', done => {
  const options = {
    componentPackage: {
      oc: {
        files: {
          template: 'template.hbs',
          data: 'server.js'
        }
      }
    },
    ocPackage: {},
    publishPath: ''
  };
  compile(options, () => {
    expect(compileView).toHaveBeenCalledTimes(1);
    compileView.mock.calls[0][0].componentPackage.oc.date = '';
    expect(compileView.mock.calls).toMatchSnapshot();

    expect(compileServer).toHaveBeenCalledTimes(1);
    compileServer.mock.calls[0][0].componentPackage.oc.date = '';
    expect(compileServer.mock.calls).toMatchSnapshot();

    expect(compileStatics).toHaveBeenCalledTimes(1);
    compileStatics.mock.calls[0][0].componentPackage.oc.date = '';
    expect(compileStatics.mock.calls).toMatchSnapshot();

    expect(fs.writeJSON).toHaveBeenCalledTimes(1);
    expect(fs.writeJSON.mock.calls).toMatchSnapshot();
    done();
  });
});

test('Should correctly invoke the various compilers when no server has been defined', done => {
  const options = {
    componentPackage: {
      oc: {
        files: {
          template: 'template.hbs'
        }
      }
    },
    ocPackage: {},
    publishPath: ''
  };
  compile(options, () => {
    expect(compileView).toHaveBeenCalledTimes(1);
    compileView.mock.calls[0][0].componentPackage.oc.date = '';
    expect(compileView.mock.calls).toMatchSnapshot();

    expect(compileServer).not.toHaveBeenCalled();

    expect(compileStatics).toHaveBeenCalledTimes(1);
    compileStatics.mock.calls[0][0].componentPackage.oc.date = '';
    expect(compileStatics.mock.calls).toMatchSnapshot();

    expect(fs.writeJSON).toHaveBeenCalledTimes(1);
    expect(fs.writeJSON.mock.calls).toMatchSnapshot();
    done();
  });
});
