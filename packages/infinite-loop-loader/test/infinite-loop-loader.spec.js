/* eslint-disable no-useless-escape */
'use strict';

const loader = require('../index.js');

describe('infinite-loop-loader', () => {
  it('should be a function with arity 1', () => {
    expect(typeof loader).toBe('function');
    expect(loader.length).toBe(1);
  });

  describe('When invoked on a js file containing loops', () => {
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
};
`;
    const result = loader(source);

    it('should wrap WhileStatement, ForStatement and DoWhileStatement correctly', () => {
      expect(result).toMatchSnapshot();
    });
  });
});
