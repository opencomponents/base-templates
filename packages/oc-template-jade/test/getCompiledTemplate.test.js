const fs = require('fs');
const getCompiledTemplate = require('../').getCompiledTemplate;

test('Return compiled template when valid', () => {
  const template =
    'var oc=oc||{};oc.components=oc.components||{},oc.components["28144f0dfecc345da2ee82c2614e61d1bd8543a9"]=function(e){var a,n=[],o=e||{};return function(e,o){n.push("<span>hi "+jade.escape(null==(a=e)?"":a)+" "+jade.escape(null==(a=o)?"":a)+"  </span>")}.call(this,"firstName"in o?o.firstName:"undefined"!=typeof firstName?firstName:void 0,"lastName"in o?o.lastName:"undefined"!=typeof lastName?lastName:void 0),n.join("")};';
  const key = '28144f0dfecc345da2ee82c2614e61d1bd8543a9';

  const result = getCompiledTemplate(template, key)
    .toString()
    .replace(/function \(/gi, 'function('); // different node versions minify differently. Hack to allow tests to pass on all node versions

  expect(result).toMatchSnapshot();
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
    'var oc=oc||{};oc.components=oc.components||{},oc.components["28144f0dfecc345da2ee82c2614e61d1bd8543a9"]=function(e){var a,n=[],o=e||{};return function(e,o){n.push("<span>hi "+jade.escape(null==(a=e)?"":a)+" "+jade.escape(null==(a=o)?"":a)+"  </span>")}.call(this,"firstName"in o?o.firstName:"undefined"!=typeof firstName?firstName:void 0,"lastName"in o?o.lastName:"undefined"!=typeof lastName?lastName:void 0),n.join("")};';
  const key = 'another key';

  expect(getCompiledTemplate(template, key)).toBeUndefined();
});
