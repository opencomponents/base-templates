/* eslint-disable no-underscore-dangle, no-var */

const jade = jest.genMockFromModule('jade');
const compileClient = jest.fn(() => '');
jade.compileClient = compileClient;

module.exports = jade;
