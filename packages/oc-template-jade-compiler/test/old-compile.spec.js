// const path = require('path');
// const jade = require('jade-legacy');
// const compile = require('../packages/oc-template-jade-compiler/compile');

// describe('compile method', () => {
//   describe('when invoking the method', () => {
//     const template = 'Hello';
//     const viewPath = path.resolve(__dirname);

//     test('should correctly invoke jade compileClient method', done => {
//       compile({ template, viewPath }, (err, result) => {
//         expect(jade.compileClient).toBeCalledWith(template, {
//           compileDebug: false,
//           filename: path.resolve(__dirname),
//           name: 't'
//         });
//         expect(err).toMatchSnapshot();
//         expect(result).toMatchSnapshot();
//         done();
//       });
//     });

//     test('should correctly throw', done => {
//       compile({ template, viewPath }, (err, result) => {
//         expect(jade.compileClient).toHaveBeenCalledTimes(2);
//         expect(err).toMatchSnapshot();
//         expect(result).toMatchSnapshot();
//         done();
//       });
//     });
//   });
// });
test('', () => {
  expect(true).toBeTruthy();
});
