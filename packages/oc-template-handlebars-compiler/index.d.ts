type Es6Template = typeof import('oc-template-handlebars');
type GenericCompiler = typeof import('oc-generic-template-compiler');

declare const compiler: {
  compile: ReturnType<GenericCompiler['createCompile']>;
  getInfo: Es6Template['getInfo'];
  getCompiledTemplate: Es6Template['getCompiledTemplate'];
  render: Es6Template['render'];
};

export = compiler;
