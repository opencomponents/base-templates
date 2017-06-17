'use strict';

const format = require('stringformat');

module.exports = (hash, content, nameSpace = 'oc') =>
  `var ${nameSpace}=${nameSpace}||{};${nameSpace}.components=${nameSpace}.components||{};${nameSpace}.components['${hash}']=${content}`;
