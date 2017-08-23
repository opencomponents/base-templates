const fs = require('fs');
const { getCompiledTemplate } = require('../index.js');

test('Return compiled template when valid', () => {
  const template =
    'var oc=oc||{};oc.components=oc.components||{},oc.components.c6fcae4d23d07fd9a7e100508caf8119e998d7a9={compiler:[7,">= 4.0.0"],main:function(o,c,e,n,a){return"Hello world!"},useData:!0};';
  const key = 'c6fcae4d23d07fd9a7e100508caf8119e998d7a9';

  expect(getCompiledTemplate(template, key)).toMatchSnapshot();
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
    'var oc=oc||{};oc.components=oc.components||{},oc.components.c6fcae4d23d07fd9a7e100508caf8119e998d7a9={compiler:[7,">= 4.0.0"],main:function(o,c,e,n,a){return"Hello world!"},useData:!0};';
  const key = 'not valid key';

  expect(getCompiledTemplate(template, key)).toBeUndefined();
});
