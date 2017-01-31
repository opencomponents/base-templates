/* eslint-disable no-underscore-dangle, no-var */

const jade = jest.genMockFromModule('jade');

var linked = jest.fn();
const __setTemplate = (fn) => {
  linked = fn;
};

const template = jest.fn(() => linked);

jade.__setTemplate = __setTemplate;
jade.template = template;
module.exports = jade;
