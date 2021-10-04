type Es6Template = typeof import('oc-template-jade');
type GenericCompiler = typeof import('oc-generic-template-compiler');

declare const renderer: {
  compile: ReturnType<GenericCompiler['createCompile']>;
  getInfo: Es6Template['getInfo'];
  getCompiledTemplate: Es6Template['getCompiledTemplate'];
  render: Es6Template['render'];
};

export = renderer;
