const upperCase = require('upper-case');

export const data = (context, callback) => {
  const { name } = context.params;
  const { staticPath } = context;

  const upperCasedName = upperCase(name);

  callback(null, {
    name,
    staticPath,
    upperCasedName
  });
};
