/* eslint-disable no-underscore-dangle, no-var */

const jade = jest.genMockFromModule('jade-legacy');
const compileClient = jest.fn(() => '');
jade.compileClient = compileClient;

module.exports = jade;
