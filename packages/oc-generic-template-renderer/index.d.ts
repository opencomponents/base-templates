export interface External {
  global: string | string[];
  url: string;
}

export interface ExternalInfo extends External {
  name: string;
}

type Callback<T = unknown> = (err: Error | null, data: T) => void;
type CompiledTemplate = (model: unknown) => string;

declare const renderer: {
  getCompiledTemplate: (
    templateString: string,
    key: string,
    context?: Record<string, unknown>
  ) => CompiledTemplate;
  getInfo: (package: {
    name: string;
    version: string;
    externals?: Record<string, External>;
  }) => { type: string; version: string; externals: Array<ExternalInfo> };
  render: (options: { model: unknown; template: CompiledTemplate }, cb: Callback<string>) => void;
};

export = renderer;
