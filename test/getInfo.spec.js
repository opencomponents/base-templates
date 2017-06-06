const getInfo = require('../packages/oc-template-jade/getInfo');

describe('getInfo method', () => {
  describe('when invoking the method', () => {
    const info = getInfo();

    test('should return the correct version', () => {
      expect(info.version).toBeDefined();
    });
    test('should return the correct template type', () => {
      expect(info.type).toBe('oc-template-jade');
    });
    test('should return the list of externals', () => {
      expect(info.externals).toMatchSnapshot();
    });
  });
});
