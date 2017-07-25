'use strict';

/*
 * External Dependencies handler for webpack
 * Returns an array with handlers to indicates dependencies that should not be
 * bundled by webPack but instead remain requested by the resulting bundle.
 * For more info http://webpack.github.io/docs/configuration.html#externals
 *
*/

const coreModules = require('builtin-modules');
const strings = require('oc-templates-messages');
const _ = require('lodash');

module.exports = dependencies => {
  const deps = dependencies || {};

  const missingExternalDependency = (dep, dependencies) =>
    !_.includes(_.keys(dependencies), dep) && !_.includes(coreModules, dep);

  const matcher = /^[a-z@][a-z\-\/0-9\.]+$/i;

  return [
    (context, req, callback) => {
      if (matcher.test(req)) {
        let dependencyName = req;
        if (/\//g.test(dependencyName)) {
          dependencyName = dependencyName.substring(
            0,
            dependencyName.indexOf('/')
          );
        }
        if (missingExternalDependency(dependencyName, deps)) {
          return callback(
            new Error(
              strings.errors.missingDependency(JSON.stringify(dependencyName))
            )
          );
        }
      }
      callback();
    },
    matcher
  ];
};
