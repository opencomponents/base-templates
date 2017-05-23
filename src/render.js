module.exports = (options, callback) => {
  try {
    callback(null, options.template(options.model).toString());
  } catch (e) {
    callback(e);
  }
};
