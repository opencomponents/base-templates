/* eslint-disable dot-notation */

const packageJson = require('./package.json');

module.exports = () => ({
  type: packageJson.name,
  version: packageJson.version,
  dependencies: packageJson.dependencies,
  externals: [
    packageJson.externals['jade']
  ]
});
