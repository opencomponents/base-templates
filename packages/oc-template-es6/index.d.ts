type GenericRenderer = typeof import('oc-generic-template-renderer');

declare const renderer: {
  getCompiledTemplate: GenericRenderer['getCompiledTemplate'];
  getInfo: () => ReturnType<GenericRenderer['getInfo']>;
  render: GenericRenderer['render'];
};

export = renderer;
