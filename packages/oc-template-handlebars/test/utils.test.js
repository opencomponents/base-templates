const utils = require('../lib/utils');

const scenarios = [
  {
    compiler: [6, '>= 2.0.0-beta.1'],
    main: function () {
      return 'Hello world!';
    },
    useData: !0
  },
  {
    compiler: [7, '>= 4.0.0'],
    main: function () {
      return 'Hello world!';
    },
    useData: !0
  }
];

scenarios.forEach(template => {
  describe('utils module', () => {
    test('should correctly validate template', () => {
      expect(utils.validator(template)).toMatchSnapshot();
    });
  });
});
