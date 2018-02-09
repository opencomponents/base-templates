const fs = require('fs');
const getCompiledTemplate = require('../').getCompiledTemplate;
const render = require('../').render;

test('Return compiled template when valid', done => {
  const template =
    'var oc=oc||{};oc.components=oc.components||{},oc.components.c6fcae4d23d07fd9a7e100508caf8119e998d7a9="Hello ${name.toUpperCase()}!"';
  const key = 'c6fcae4d23d07fd9a7e100508caf8119e998d7a9';

  const compiled = getCompiledTemplate(template, key);
  expect(compiled).toMatchSnapshot();
  render({ template: compiled, model: { name: 'es6' } }, (err, html) => {
    expect(err).toBe(null);
    expect(html).toBe('Hello ES6!');
    done();
  });
});

test('Throw exception when js is not valid', () => {
  const template =
    'var oc=oc||{};oc.components=oc.components||{},oc.components.c6fcae4d23d07fd9a7e100508caf8119e998d7a9=nojavascript);';
  const key = 'c6fcae4d23d07fd9a7e100508caf8119e998d7a9';

  expect(() =>
    getCompiledTemplate(template, key)
  ).toThrowErrorMatchingSnapshot();
});

test('Be undefined when key is not valid', () => {
  const template =
    'var oc=oc||{};oc.components=oc.components||{},oc.components.c6fcae4d23d07fd9a7e100508caf8119e998d7a9="Hello ${name.toUpperCase()}!"';
  const key = 'not valid key';

  expect(getCompiledTemplate(template, key)).toBeUndefined();
});
