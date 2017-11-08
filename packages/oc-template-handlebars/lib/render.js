const handlebars = require('handlebars');
const Cache = require('nice-cache');

const { name, version } = require('../package');
const utils = require('./utils');

const cache = new Cache();
const cacheType = `${name}-${version}-precompiled`;

module.exports = (options, callback) => {
  let linked;
  const cached = options.key && cache.get(cacheType, options.key);

  if (!cached) {
    const validationResult = utils.validator(options.template);
    if (!validationResult.isValid) {
      return callback(validationResult.error);
    }

    try {
      linked = handlebars.template(options.template);
      cache.set(cacheType, options.key);
    } catch (e) {
      return callback(e);
    }
  }

  try {
    const html = linked(options.model);
    return callback(null, html);
  } catch (e) {
    return callback(e);
  }
};
