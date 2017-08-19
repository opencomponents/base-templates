module.exports = packageJson => {
  const externals = Object.keys(packageJson.externals).map(
    dep => packageJson.externals[dep]
  );

  return {
    type: packageJson.name,
    version: packageJson.version,
    externals
  };
};
