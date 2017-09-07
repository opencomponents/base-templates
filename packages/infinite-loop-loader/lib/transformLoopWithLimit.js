'use strict';

const strings = require('oc-templates-messages');

module.exports = limit => {
  const loopNodeTypes = ['WhileStatement', 'ForStatement', 'DoWhileStatement'];

  const isUnlabeledLoop = node =>
    loopNodeTypes.indexOf(node.type) > -1 &&
    node.parent.type !== 'LabeledStatement';

  const isLabeledLoop = node =>
    loopNodeTypes.indexOf(node.type) > -1 &&
    node.parent.type === 'LabeledStatement';

  const isBodyOfLoop = node =>
    node.type === 'BlockStatement' &&
    loopNodeTypes.indexOf(node.parent.type) > -1;

  const addVarDeclarationBeforeNode = (node, limit) => {
    node.update(`
      var __ITER = ${limit};
      ${node.source()}`);

    if (node.parent && node.parent.consequent !== undefined) {
      node.update(`{
        ${node.source()}
      }`);
    }
  };

  const addGuardsToLoopBody = node =>
    node.update(
      `{ if (__ITER <= 0) {
        throw new Error("${strings.errors.loopExceededIterations()}");
      }
      __ITER--;
      ${node.source().substr(1)}`
    );

  return function transformLoop(node) {
    if (isUnlabeledLoop(node)) {
      addVarDeclarationBeforeNode(node, limit);
    }

    if (isLabeledLoop(node)) {
      addVarDeclarationBeforeNode(node.parent, limit);
    }

    if (isBodyOfLoop(node)) {
      addGuardsToLoopBody(node);
    }
  };
};
