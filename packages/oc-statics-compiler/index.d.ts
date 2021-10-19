declare const compiler: (
  options: {
    componentPackage: {
      oc: {
        files: {
          static?: string[];
        };
      };
      minify?: boolean;
    };
    componentPath: string;
    publishPath: string;
    minify: boolean;
  },
  callback: (err: Error | null, data: 'ok') => void
) => void;

export = compiler;
