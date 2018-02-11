// TODO: add css instructions only if css !== null

const viewTemplate = ({ css, bundle }) => `function(model){
  var template = ${bundle};
  return template.default(model) +
    '<script>' +
      'window.oc = window.oc || {};' +
      'oc.cmd = oc.cmd || [];' +
      'oc.cmd.push(function(oc){' +
        'oc.addStylesToHead(\\'${css}\\');' +
    '});' +
    '</script>'
}`;

module.exports = viewTemplate;
