const http = require('http');
const url = require('url');
const querystring = require('querystring');
const oc = require('oc');

module.exports = (port, cb) => {
  port = port || 4000;
  cb =
    cb ||
    function() {
      console.log('started');
    };

  const client = new oc.Client({
    registries: {
      clientRendering: 'http://localhost:3000/',
      serverRendering: 'http://localhost:3000/'
    }
  });

  return http
    .createServer(function(req, res) {
      const parameters = querystring.parse(url.parse(req.url).query);
      const components = [
        { name: 'oc-client' },
        { name: 'base-component-es6', parameters },
        { name: 'base-component-handlebars', parameters },
        { name: 'base-component-jade', parameters }
      ];
      const options = {
        container: false,
        disableFailoverRendering: true,
        timeout: 100
      };

      client.renderComponents(components, options, function(
        err,
        [ocClient, es6Component, handlebarsComponent, jadeComponent]
      ) {
        if (err) {
          throw err;
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        const html = `<!DOCTYPE html>
        <html>
          <head>
            <title>A page</title>
          </head>
          <body>
            ${es6Component.replace(/data-hash=\".*?\"/, '')}
            ${handlebarsComponent}
            ${jadeComponent}
            ${ocClient}
          </body>
        </html>
      `;
        res.end(html);
      });
    })
    .listen(port, cb);
};
