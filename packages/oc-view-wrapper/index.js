'use strict';

module.exports = (hash, content, nameSpace = 'oc') =>
  `var ${nameSpace}=${nameSpace}||{};${nameSpace}.components=${nameSpace}.components||{};${nameSpace}.components['${hash}']=${content}`;
