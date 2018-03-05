module.exports = packageJson => {
  const externals = packageJson.externals
    ? Object.keys(packageJson.externals).map(dep => {
      const ext = packageJson.externals[dep];
      ext.name = dep;
      return ext;
    })
    : [];

  return {
    type: packageJson.name,
    version: packageJson.version,
    externals
  };
};
