/**
 * @testEnvironment jsdom
 */

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const server = require('../server');
const { cli, Registry } = require('oc');
const path = require('path');
const r = require('request-promise-native');
const jsdom = require('jsdom');
const JSDOM = jsdom.JSDOM;
const fs = require('fs-extra');

const registryPort = 3000;
const registryUrl = `http://localhost:${registryPort}/`;
const serverPort = 4000;
const serverUrl = `http://localhost:${serverPort}/`;
const components = [
  {
    name: 'base-component-handlebars',
    template: require('../../packages/oc-template-handlebars'),
    path: path.join(
      __dirname,
      '../../acceptance-components/base-component-handlebars'
    )
  },
  {
    name: 'base-component-jade',
    template: require('../../packages/oc-template-jade'),
    path: path.join(
      __dirname,
      '../../acceptance-components/base-component-jade'
    )
  },
  {
    name: 'base-component-es6',
    template: require('../../packages/oc-template-es6'),
    path: path.join(__dirname, '../../acceptance-components/base-component-es6')
  }
];

let registry;
let testServer;

const semverRegex = /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b/gi;

beforeAll(done => {
  components.forEach(component => {
    fs.removeSync(path.join(component.path, '_package'));
  });

  const promisify = fn => options =>
    new Promise((resolve, reject) =>
      fn(options, err => (err ? reject(err) : resolve()))
    );
  const packageAsync = promisify(cli.package);

  const packaged = components.map(component =>
    packageAsync({
      componentPath: component.path
    })
  );

  Promise.all(packaged)
    .then(() => {
      registry = new Registry({
        local: true,
        discovery: true,
        verbosity: 0,
        path: path.join(__dirname, '../../acceptance-components'),
        port: registryPort,
        baseUrl: registryUrl,
        env: {},
        templates: components
          .map(component => component.template)
          .filter(template => {
            // we need only the non-default templates here
            const type = template.getInfo().type;
            return (
              type !== 'oc-template-handlebars' && type !== 'oc-template-jade'
            );
          })
      });

      registry.start(err => {
        if (err) {
          return done(err);
        }
        testServer = server(serverPort, err => {
          if (err) {
            return done(err);
          }
          done();
        });
      });
    })
    .catch(err => {
      return done(err);
    });
});

afterAll(done => {
  testServer.close(() => {
    registry.close(() => {
      components.forEach(component => {
        fs.removeSync(path.join(component.path, '_package'));
      });
      done();
    });
  });
});

test('Registry should correctly serve rendered components', done => {
  const rendered = components.map(component =>
    r(registryUrl + `${component.name}/?name=SuperMario`)
      .then(body => {
        const bodyVersionless = body.replace(semverRegex, '6.6.6');
        return Promise.resolve(bodyVersionless);
      })
      .catch(err => Promise.reject(err))
  );
  Promise.all(rendered)
    .then(responses => {
      responses.forEach(response => expect(response).toMatchSnapshot());
      done();
    })
    .catch(err => done(err));
});

test('Registry should correctly serve unrendered components', done => {
  const unrendered = components.map(component =>
    r({
      uri: registryUrl + `${component.name}/?name=SuperMario`,
      headers: {
        Accept: 'application/vnd.oc.unrendered+json'
      }
    })
      .then(body => {
        const bodyVersionless = body.replace(semverRegex, '6.6.6');
        return Promise.resolve(bodyVersionless);
      })
      .catch(err => Promise.reject(err))
  );

  Promise.all(unrendered)
    .then(responses => {
      responses.forEach(response => expect(response).toMatchSnapshot());
      done();
    })
    .catch(err => done(err));
});

test('server-side-side rendering', done => {
  JSDOM.fromURL(`${serverUrl}?name=SuperMario`, {})
    .then(dom => {
      const domVersionless = dom.serialize().replace(semverRegex, '6.6.6');
      expect(domVersionless).toMatchSnapshot();
      done();
    })
    .catch(err => done(err));
});

test('client-side-side rendering', done => {
  const rendered = components.map(component =>
    JSDOM.fromURL(`${registryUrl}${component.name}/~preview?name=SuperMario`, {
      resources: 'usable',
      runScripts: 'dangerously'
    })
      .then(
        dom =>
          new Promise(resolve => {
            setTimeout(() => {
              const node = dom.window.document.getElementById(component.name);
              return resolve(node);
            }, 5000);
          })
      )
      .catch(err => Promise.reject(err))
  );

  Promise.all(rendered)
    .then(responses => {
      responses.forEach(response => expect(response).toMatchSnapshot());
      done();
    })
    .catch(err => done(err));
});
