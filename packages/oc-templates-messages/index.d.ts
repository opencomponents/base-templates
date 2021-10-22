declare const messages: {
  errors: {
    compilationFailed: (viewFileName: string, error: string) => string;
    cssNotValid: () => string;
    folderNotFound: (directoryPath: string) => string;
    folderNotValid: (directoryPath: string) => string;
    legacyComponent: () => string;
    loopExceededIterations: () => string;
    missingDependency: (dependencyName: string) => string;
    viewNotFound: (viewFileName: string) => string;
  };
};

export = messages;
