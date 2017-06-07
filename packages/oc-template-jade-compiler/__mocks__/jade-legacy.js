const jade = jest.genMockFromModule('jade-legacy');
const compileClient = jest
  .fn(() => '')
  .mockImplementationOnce((template, options) => template)
  .mockImplementationOnce((template, options) => {
    throw new Error('Whoops!');
  });

jade.compileClient = compileClient;

module.exports = jade;
