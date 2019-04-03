const fs = require('fs');
const package = require('./packages/oc-template-handlebars/package.json');

package.externals.handlebars.url = `https://unpkg.com/handlebars@${
  package.dependencies.handlebars
}/dist/handlebars.runtime.min.js`;

fs.writeFileSync(
  './packages/oc-template-handlebars/package.json',
  JSON.stringify(package, null, 2) + '\n',
  'utf-8'
);
