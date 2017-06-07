const getInfo = require('../packages/oc-template-jade/getInfo');

describe('getInfo method', () => {
  describe('when invoking the method', () => {
    test('should return the correct info', () => {
      expect(getInfo()).toMatchSnapshot();
    });
  });
});
