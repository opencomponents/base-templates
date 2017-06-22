const strings = require('../resources/strings');

module.exports = {
  validator: template => {
    const isUnsupported = template.compiler[0] < 7;
    if (isUnsupported) {
      return {
        isValid: false,
        error: strings.messages.legacyComponent
      };
    }

    return {
      isValid: true
    };
  }
};
