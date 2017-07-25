module.exports = {
  errors: {
    compilationFailed: (viewFileName, error) =>
      `${viewFileName} compilation failed - ${error}`,
    cssNotValid: () => `Css is not valid`,
    folderNotFound: directoryPath => `"${directoryPath}" not found`,
    folderNotValid: directoryPath => `"${directoryPath}" must be a directory`,
    legacyComponent: () =>
      `The component can't be rendered because it was published with an older OC version`,
    loopExceededIterations: () => `Loop exceeded maximum allowed iterations`,
    missingDependency: dependencyName =>
      `Missing dependencies from package.json => ${dependencyName}`,
    viewNotFound: viewFileName => `file ${viewFileName} not found`
  }
};
