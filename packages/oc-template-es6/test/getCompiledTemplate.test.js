const fs = require('fs');
const getCompiledTemplate = require('../').getCompiledTemplate;

test('Return compiled template when valid', () => {
  const template =
    'var oc=oc||{};oc.components=oc.components||{},oc.components.c6fcae4d23d07fd9a7e100508caf8119e998d7a9=({name})=>`Hello ${name.toUpperCase()}!`;';
  const key = 'c6fcae4d23d07fd9a7e100508caf8119e998d7a9';

  const compiled = getCompiledTemplate(template, key);
  expect(compiled).toMatchSnapshot();
});

test('Throw exception when not valid', () => {
  const template =
    'var oc=oc||{};oc.components=oc.components||{},oc.components["28144f0dfecc345da2ee82c2614e61d1bd8543a9"]=something);';
  const key = '28144f0dfecc345da2ee82c2614e61d1bd8543a9';

  expect(() =>
    getCompiledTemplate(template, key)
  ).toThrowErrorMatchingSnapshot();
});

test('Return undefined when key when valid', () => {
  const template =
    'var oc=oc||{};oc.components=oc.components||{},oc.components["28144f0dfecc345da2ee82c2614e61d1bd8543a9"]=({name})=>`Hello ${name.toUpperCase()}!`;';
  const key = 'another key';

  expect(getCompiledTemplate(template, key)).toBeUndefined();
});
