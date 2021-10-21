import type { Configuration } from 'webpack';

declare const externalDependenciesHandler: (
  dependencies: Record<string, string>
) => Configuration['externals'];

export = externalDependenciesHandler;
