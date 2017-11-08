const strings = require('oc-templates-messages');

module.exports = {
  validator: template => {
    const isUnsupported = template.compiler[0] < 7;
    if (isUnsupported) {
      return {
        isValid: false,
        error: strings.errors.legacyComponent()
      };
    }

    return { isValid: true };
  }
};
