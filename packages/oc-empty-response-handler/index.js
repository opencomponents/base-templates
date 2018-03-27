const viewModelEmptyKey = '__oc_emptyResponse';

module.exports = {
  contextDecorator: callback => () =>
    callback(null, { [viewModelEmptyKey]: true }),
  shouldRenderAsEmpty: model => model[viewModelEmptyKey] === true,
  viewModelEmptyKey
};
