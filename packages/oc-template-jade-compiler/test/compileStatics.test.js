jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

const path = require('path');
const fs = require('fs-extra');
const nodeDir = require('node-dir');

const compileStatics = require('../lib/compileStatics.js');
const componentPath = path.join(__dirname, '../../../mocks/jade-component');
const publishPath = path.join(componentPath, '_package');
const publishFileName = 'template.js';
const withStatic = (staticFiles, minify) => ({
  componentPackage: {
    oc: {
      files: {
        static: staticFiles
      }
    }
  },
  publishPath,
  componentPath,
  minify: minify || false
});

afterEach(() => {
  fs.emptyDirSync(publishPath + '/assets');
});

test('when oc.files.static is empty', done => {
  compileStatics(withStatic([]), (error, result) => {
    expect(error).toBeNull();
    expect(result).toBe('ok');
    done();
  });
});

test('when oc.files.static contains a folder that doesnt exist', done => {
  compileStatics(withStatic(['src']), (error, result) => {
    expect(error).toContain('not found');
    expect(result).toBeUndefined();
    done();
  });
});

test('when oc.files.static contain reference to a non-folder', done => {
  compileStatics(withStatic(['template.jade']), (error, result) => {
    expect(error).toContain('must be a directory');
    expect(result).toBeUndefined();
    done();
  });
});

test('compile statics when oc.files.static contains valid folder and minify is false', done => {
  compileStatics(withStatic(['assets']), (error, result) => {
    expect(error).toBeNull();
    expect(result).toBe('ok');
    nodeDir.paths(publishPath + '/assets', (err, res) => {
      const files = res.files.sort();
      expect(
        files.map(file => path.relative(__dirname, file))
      ).toMatchSnapshot();
      files.forEach(file => {
        if (!/.png$/.test(file)) {
          expect(fs.readFileSync(file, 'UTF8')).toMatchSnapshot();
        }
      });
      done();
    });
  });
});

test('compile statics when oc.files.static contains valid folder and minify is true', done => {
  const minify = true;
  compileStatics(withStatic(['assets'], minify), (error, result) => {
    expect(error).toBeNull();
    expect(result).toBe('ok');
    nodeDir.paths(publishPath + '/assets', (err, res) => {
      const files = res.files.sort();
      expect(
        files.map(file => path.relative(__dirname, file))
      ).toMatchSnapshot();
      files.forEach(file => {
        if (!/.png$/.test(file)) {
          expect(fs.readFileSync(file, 'UTF8')).toMatchSnapshot();
        }
      });
      done();
    });
  });
});
