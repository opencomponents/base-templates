'use strict';

module.exports = function ocViewWrapper(hash, content, nameSpace = 'oc') {
  return `var ${nameSpace}=${nameSpace}||{};${nameSpace}.components=${nameSpace}.components||{};${nameSpace}.components['${hash}']=${content}`;
};
