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
  bundle: { hashKey: string };
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

interface CompilerOptions {
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

type CompileView = (
  options: CompilerOptions,
  cb: Callback<CompiledViewInfo>
) => void;
type CompileServer = (
  options: CompilerOptions & { compiledViewInfo: CompiledViewInfo },
  cb: Callback<any>
) => void;
type CompileStatics = (options: CompilerOptions, cb: Callback<'ok'>) => void;
type GetInfo = () => {
  type: string;
  version: string;
  externals: Array<{
    name: string;
    global: string | string[];
    url: string;
  }>;
};

declare const compiler: {
  createCompile: (compilers: {
    compileView: CompileView;
    compileServer: CompileServer;
    compileStatics: CompileStatics;
    getInfo: GetInfo;
  }) => (options: CompilerOptions, cb: Callback) => void;
};

export = compiler;
