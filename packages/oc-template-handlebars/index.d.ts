type GenericRenderer = typeof import('oc-generic-template-renderer');

type Callback<T = unknown> = (err: Error | null, data: T) => void;
type CompiledTemplate = (model: unknown) => string;

declare const renderer: {
  getCompiledTemplate: GenericRenderer['getCompiledTemplate'];
  getInfo: () => ReturnType<GenericRenderer['getInfo']>;
  render: (options: { model: unknown; template: CompiledTemplate }, cb: Callback<string>) => void;
};

export = renderer;
