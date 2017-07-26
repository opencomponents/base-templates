jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const _ = require('lodash');
const compileView = require('../lib/compileView.js');
const fs = require('fs-extra');
const path = require('path');

const componentPath = path.join(
  __dirname,
  '../../../mocks/handlebars-component'
);
const publishPath = path.join(componentPath, '_compile-view-package');
const publishFileName = 'template.js';

const options = {
  componentPackage: {
    oc: {
      files: {
        template: {
          src: 'template.hbs',
          type: 'handlebars'
        }
      }
    }
  },
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
    fs.removeSync(path.resolve(publishPath));
    done();
  });
});

test('When view not found should return error', done => {
  const options2 = _.cloneDeep(options);
  options2.componentPackage.oc.files.template.src = 'not-found.hbs';
  compileView(options2, (err, compiledViewInfo) => {
    expect(err).toMatchSnapshot();
    done();
  });
});

test('When view not valid should return error', done => {
  const spy = jest
    .spyOn(fs, 'readFile')
    .mockImplementation(
      jest.fn((a, b, cb) => cb(null, '<h1>{{something</h1>'))
    );

  compileView(options, (err, compiledViewInfo) => {
    expect(err).toMatchSnapshot();
    spy.mockRestore();
    done();
  });
});

test('When compiled view writing fails should return error', done => {
  const spy = jest
    .spyOn(fs, 'ensureDir')
    .mockImplementation(jest.fn((a, cb) => cb('sorry I failed')));

  compileView(options, (err, compiledViewInfo) => {
    expect(err).toMatchSnapshot();
    spy.mockRestore();
    done();
  });
});
