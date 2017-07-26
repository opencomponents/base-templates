jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const path = require('path');
const fs = require('fs-extra');
const nodeDir = require('node-dir');

const compileStatics = require('../lib/compileStatics.js');
const componentPath = path.join(
  __dirname,
  '../../../mocks/handlebars-component'
);
const publishFileName = 'template.js';

const withStatic = (staticFiles, publishPackagePath, minify) => {
  fs.ensureDirSync(path.join(componentPath, publishPackagePath));

  return {
    componentPackage: {
      oc: {
        files: {
          static: staticFiles
        }
      }
    },
    publishPath: path.join(componentPath, publishPackagePath),
    componentPath,
    minify: minify || false
  };
};

test('when oc.files.static is empty', done => {
  compileStatics(withStatic([], '_compile-static-package'), (error, result) => {
    expect(error).toBeNull();
    expect(result).toBe('ok');
    fs.remove(path.join(componentPath, '_compile-static-package'), done);
  });
});

test('when oc.files.static contains a folder that doesnt exist', done => {
  compileStatics(
    withStatic(['src'], '_compile-static-package2'),
    (error, result) => {
      expect(error).toContain('not found');
      expect(result).toBeUndefined();
      fs.remove(path.join(componentPath, '_compile-static-package2'), done);
    }
  );
});

test('when oc.files.static contain reference to a non-folder', done => {
  compileStatics(
    withStatic(['template.hbs'], '_compile-static-package3'),
    (error, result) => {
      expect(error).toContain('must be a directory');
      expect(result).toBeUndefined();
      fs.remove(path.join(componentPath, '_compile-static-package3'), done);
    }
  );
});

test('compile statics when oc.files.static contains valid folder and minify is false', done => {
  compileStatics(
    withStatic(['assets'], '_compile-static-package4'),
    (error, result) => {
      expect(error).toBeNull();
      expect(result).toBe('ok');
      nodeDir.paths(
        path.join(componentPath, '_compile-static-package4/assets'),
        (err, res) => {
          const files = res.files.sort();
          expect(
            files.map(file => path.relative(__dirname, file))
          ).toMatchSnapshot();
          files.forEach(file => {
            if (!/.png$/.test(file)) {
              expect(fs.readFileSync(file, 'UTF8')).toMatchSnapshot();
            }
          });
          fs.remove(path.join(componentPath, '_compile-static-package4'), done);
        }
      );
    }
  );
});

test('compile statics when oc.files.static contains valid folder and minify is true', done => {
  const minify = true;
  compileStatics(
    withStatic(['assets'], '_compile-static-package5', minify),
    (error, result) => {
      expect(error).toBeNull();
      expect(result).toBe('ok');
      nodeDir.paths(
        path.join(componentPath, '_compile-static-package5/assets'),
        (err, res) => {
          const files = res.files.sort();
          expect(
            files.map(file => path.relative(__dirname, file))
          ).toMatchSnapshot();
          files.forEach(file => {
            if (!/.png$/.test(file)) {
              expect(fs.readFileSync(file, 'UTF8')).toMatchSnapshot();
            }
          });
          fs.remove(path.join(componentPath, '_compile-static-package5'), done);
        }
      );
    }
  );
});

test('When static files writing fails should return error', done => {
  const spy = jest
    .spyOn(fs, 'ensureDir')
    .mockImplementation(jest.fn((a, cb) => cb('sorry I failed')));

  const minify = true;
  compileStatics(
    withStatic(['assets'], '_compile-static-package6', minify),
    err => {
      expect(err).toMatchSnapshot();
      spy.mockRestore();
      fs.remove(path.join(componentPath, '_compile-static-package6'), done);
    }
  );
});

test('When static file fails to be read should return error', done => {
  const spy = jest
    .spyOn(fs, 'readFile')
    .mockImplementation(jest.fn((a, cb) => cb('sorry I failed')));

  const minify = true;
  compileStatics(
    withStatic(['assets'], '_compile-static-package7', minify),
    err => {
      expect(err).toMatchSnapshot();
      spy.mockRestore();
      fs.remove(path.join(componentPath, '_compile-static-package7'), done);
    }
  );
});
