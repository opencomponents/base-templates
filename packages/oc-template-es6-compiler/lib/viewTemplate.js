const viewTemplate = ({ css, bundle }) => `function(model){
  var template = ${bundle};
  return '' + 
    template.default(model) +
    '${
  css
    ? '<style>' +
          css +
          '</style>' +
          '<script>' +
          'window.oc = window.oc || {};' +
          'oc.cmd = oc.cmd || [];' +
          'oc.cmd.push(function(oc){' +
          "oc.events.fire(\\'oc:cssDidMount\\', \\'" +
          css +
          "\\');" +
          '});' +
          '</script>'
    : ''
}'
      
}`;

module.exports = viewTemplate;
