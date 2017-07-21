module.exports = {
  errors: {
    COMPILATION_FAILED: (viewFileName, error) =>
      `${viewFileName} compilation failed - ${error}`,
    CSS_IS_NOT_VALID: () => `Css is not valid`,
    FOLDER_IS_NOT_A_FOLDER: directoryPath =>
      `"${directoryPath}" must be a directory`,
    FOLDER_NOT_FOUND: directoryPath => `"${directoryPath}" not found`,
    LEGACY_COMPONENT: () =>
      `The component can't be rendered because it was published with an older OC version`,
    LOOP_EXCEEDED_ITERATIONS: () => `Loop exceeded maximum allowed iterations`,
    MISSING_DEPENDENCY: dependencyName =>
      `Missing dependencies from package.json => ${dependencyName}`,
    VIEW_NOT_FOUND: viewFileName => `file ${viewFileName} not found`
  }
};
