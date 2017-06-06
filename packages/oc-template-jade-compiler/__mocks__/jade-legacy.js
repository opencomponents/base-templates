const jade = jest.genMockFromModule('jade-legacy');
const compileClient = jest.fn(() => '');
jade.compileClient = compileClient;

module.exports = jade;
