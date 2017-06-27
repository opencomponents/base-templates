'use strict';

module.exports = (hash, content, nameSpace) => {
  nameSpace = nameSpace || 'oc';
  return `var ${nameSpace}=${nameSpace}||{};${nameSpace}.components=${nameSpace}.components||{};${nameSpace}.components['${hash}']=${content}`;
};
