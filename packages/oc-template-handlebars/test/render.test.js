const render = require('../lib/render');

describe('render method', () => {
  describe('when invoked with a invalid template', () => {
    const model = { aModel: true };
    const key = 'not-valid-hashed-broken-view';
    const template = {
      compiler: [6, '>= 3.0.0'],
      main: function () {
        return 'Hello world!';
      },
      useData: !0
    };
    const callback = jest.fn();

    render({ key, model, template }, callback);
    test('should correctly return error', () => {
      expect(callback).toBeCalledWith(
        "The component can't be rendered because it was published with an older OC version"
      );
    });
  });

  describe('when invoked with a broken template', () => {
    const model = { aModel: true };
    const key = 'not-valid-hashed-broken-view';
    const template = {
      compiler: [7, '>= 4.0.0'],
      useData: !0
    };

    test('should fire an error', done => {
      render({ key, model, template }, err => {
        expect(err.toString()).toContain('Unknown template object');
        done();
      });
    });
  });

  describe('when invoked with a valid template', () => {
    const model = { aModel: true };
    const key = 'c6fcae4d23d07fd9a7e100508caf8119e998d7a9';
    const template = {
      compiler: [7, '>= 4.0.0'],
      main: function () {
        return 'Hello world!';
      },
      useData: !0
    };
    const callback = jest.fn();

    render({ key, model, template }, callback);
    test('should correctly invoke the callback', () => {
      expect(callback).toBeCalledWith(null, 'Hello world!');
    });
  });

  describe('when invoked with a valid template with valid view-models', () => {
    const key = '9898be34d6ca0d1fe2da808ed14c3f089a7d4a78';
    const template = {
      compiler: [7, '>= 4.0.0'],
      main: function (a, n, e, c, o) {
        let t,
          l = null != n ? n : {},
          s = e.helperMissing,
          i = 'function',
          m = a.escapeExpression;
        return (
          '<img src="' +
          m(
            ((t =
              null != (t = e.staticPath || (null != n ? n.staticPath : n))
                ? t
                : s),
            typeof t === i
              ? t.call(l, { name: 'staticPath', hash: {}, data: o })
              : t)
          ) +
          'img/logo.png" />\n\n<div>Hello ' +
          m(
            ((t = null != (t = e.name || (null != n ? n.name : n)) ? t : s),
            typeof t === i ? t.call(l, { name: 'name', hash: {}, data: o }) : t)
          ) +
          '</div>\n'
        );
      },
      useData: !0
    };

    let response;
    const callback = (err, res) => (response = res);

    ['John', 'Jane', 'Mike'].forEach(name => {
      test(`should correctly render with viewmodel = {name:"${name}"}`, done => {
        render({ key, template, model: { name } }, (err, res) => {
          expect(res).toMatchSnapshot();
          done();
        });
      });
    });
  });

  describe('when invoked with a broken view that throws an exception', () => {
    const model = { aModel: true };
    const key = 'another-broken-view';
    const template = {
      compiler: [7, '>= 4.0.0'],
      main: function () {
        throw new Error('blargh');
      },
      useData: !0
    };
    const callback = jest.fn();

    render({ key, model, template }, callback);
    test('should fire an error', () => {
      expect(callback).toBeCalledWith(new Error('blargh'));
    });
  });
});
