/* eslint-disable no-useless-escape */
'use strict';

const loader = require('../index.js');

describe('infinite-loop-loader', () => {
  it('should be a function with arity 1', () => {
    expect(typeof loader).toBe('function');
    expect(loader.length).toBe(1);
  });

  const source = `
module.exports.data = function(context, cb) {
  var x, y, z;

  while(true) {
    x = 234;
  }

  for(var i = 0; i < 10; i++) {
    y = 456;
  }

  do {
    z = 342;
  } while(false);

  loopWhile:
  while(true) {
    x = 234;
  }

  loopFor:
  for(var i = 0; i < 10; i++) {
    y = 456;
  }

  loopDoWhile:
  do {
    z = 342;
  } while(false);
  return cb(null, data)
 
  if (false) while (true) {}
  else while (true) {}
};
`;

  describe('When invoked on a js file containing loops', () => {
    const result = loader(source);

    it('should wrap WhileStatement, ForStatement and DoWhileStatement correctly', () => {
      expect(result).toMatchSnapshot();
    });
  });

  describe('When invoked with custom options', () => {
    const loader2 = loader.bind({
      loaders: [
        {
          options: {
            limit: 1000
          }
        }
      ],
      loaderIndex: 0
    });

    const result = loader2(source);

    it('should wrap WhileStatement, ForStatement and DoWhileStatement correctly with limit=1000', () => {
      expect(result).toMatchSnapshot();
    });
  });
});
