const createCompile = require('../lib/createCompile');
const compileStatics = jest.fn();
const compileView = jest.fn();
const compileServer = jest.fn();
const getInfo = jest.fn();

test('Should correctly create a compiler function', () => {
  const compiler = createCompile({
    compileServer,
    compileView,
    compileStatics,
    getInfo
  });

  expect(compiler).toBeInstanceOf(Function);
  expect(compiler.length).toBe(2);
  expect(compiler.toString()).toMatchSnapshot();
});
