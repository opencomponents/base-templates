declare const compiler: (
  options: {
    componentPackage: {
      oc: {
        files: {
          data: string;
        };
      };
      dependencies?: Record<string, string>;
    };
    production: boolean;
    publishPath: string;
    componentPath: string;
    publishFileName?: string;
    verbose: boolean;
  },
  callback: (
    err: Error | null,
    data: {
      type: string;
      hashKey: string;
      src: string;
    }
  ) => void
) => void;

export = compiler;
