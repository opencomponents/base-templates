type GenericRenderer = typeof import('oc-generic-template-renderer');

declare const renderer: {
  getCompiledTemplate: (
    templateString: string,
    key: string
  ) => ReturnType<GenericRenderer['getCompiledTemplate']>;
  getInfo: () => ReturnType<GenericRenderer['getInfo']>;
  render: GenericRenderer['render'];
};

export = renderer;
