type Callback<T = unknown> = (err: Error | null, data: T) => void;
interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}
interface CompiledViewInfo {
  template: {
    type: string;
    hashKey: string;
    src: string;
  };
  bundle: {
    hashKey: string;
  };
}
type OcOptions = {
  files: {
    data: string;
    template: {
      src: string;
      type: string;
    };
    static: string[];
  };
};
export interface CompilerOptions {
  componentPackage: PackageJson & {
    oc: OcOptions;
  };
  componentPath: string;
  minify: boolean;
  ocPackage: PackageJson;
  production: boolean;
  publishPath: string;
  verbose: boolean;
  watch: boolean;
}
export type CompileView = (
  options: CompilerOptions,
  cb: Callback<CompiledViewInfo>
) => void;
export type CompileServer = (
  options: CompilerOptions & {
    compiledViewInfo: CompiledViewInfo;
  },
  cb: Callback<any>
) => void;
export type CompileStatics = (
  options: CompilerOptions,
  cb: Callback<'ok'>
) => void;
export type GetInfo = () => {
  type: string;
  version: string;
  externals: Array<{
    name: string;
    global: string | string[];
    url: string;
  }>;
};
export type Compilers = {
  compileView: CompileView;
  compileServer: CompileServer;
  compileStatics: CompileStatics;
  getInfo: GetInfo;
};
export declare const createCompile: ({
  compileServer,
  compileView,
  compileStatics,
  getInfo
}: Compilers) => (options: CompilerOptions, callback: Callback) => void;
export {};
