const getInfo = require('./getInfo');

describe('getInfo method', () => {
  describe('when invoking the method', () => {
    const info = getInfo();

    test('should return the correct version', () => {
      expect(info.version).toBe('1.0.0');
    });
    test('should return the correct template type', () => {
      expect(info.type).toBe('jade');
    });
    test('should return the list of dependencies', () => {
      const dependencies = { jade: '^1.11.0' };
      expect(info.dependencies).toMatchObject(dependencies);
    });
  });
});
