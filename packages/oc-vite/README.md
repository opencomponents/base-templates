This is a modification of [Vite](https://github.com/vitejs/vite/) that allows for having external assets when importing (without inlining) when on library mode.

By default, `build.assetsInlineLimit` is ignored when `build.lib` is enabled, which makes sense for actual libraries. But in the case of [oc](https://github.com/opencomponents/oc), we want to keep it as externals, so then they can be served dynamically at runtime using [renderBuiltUrl](https://vitejs.dev/guide/build.html#advanced-base-options).

This repository is not even forking the library, and will, at publish time, just download the repo, modify the line responsible of allowing this, and then just build and publish.