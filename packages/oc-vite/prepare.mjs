import { promisify } from 'node:util';
import child_process from 'node:child_process';
import fs from 'fs';

const exec = promisify(child_process.exec);
const readJSON = filePath => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const pkgJson = readJSON('./package.json', 'utf-8');
const rmDir = path => {
  try {
    fs.rmSync(path, { recursive: true });
  } catch {
    // Empty
  }
};

/**
 * Check before publishing that the fields of package.json are equal to the ones
 * in the vite package
 * @param {*} pkgJson
 * @param {*} vitePkgJson
 */
function checkPackages(pkgJson, vitePkgJson) {
  const fields = [
    'dependencies',
    'optionalDependencies',
    'peerDependencies',
    'peerDependenciesMeta',
    'engines',
    'license',
    'author',
    'keywords'
  ];
  const differences = [];

  for (const field of fields) {
    const pkg = JSON.stringify(pkgJson[field]);
    const vitePkg = JSON.stringify(vitePkgJson[field]);

    if (pkg !== vitePkg) {
      differences.push({ field, differences: { pkg, vitePkg } });
    }
  }

  if (differences.length) {
    throw new Error(JSON.stringify(differences));
  }
}

/**
 * Remove condition of always inlining assets on build mode
 * @param {string} file
 */
function fixBuild(path) {
  const file = fs.readFileSync(path, 'utf-8');

  const buildCondition = 'config.build.lib ||';

  if (file.match(buildCondition).length !== 1) {
    throw new Error(
      'Source code does not match expectations for automatic replacement of condition'
    );
  }

  const fixedBuild = file.replace(buildCondition, '');

  fs.writeFileSync(path, fixedBuild, 'utf-8');
}

async function main() {
  rmDir('./bin');
  rmDir('./dist');
  rmDir('./types');
  rmDir('./vite');

  console.log('Cloning repository');
  await exec('git clone https://github.com/vitejs/vite.git');
  await exec(`git checkout v${pkgJson.version}`, { cwd: './vite' });
  rmDir('./vite/.git');

  const vitePkgJson = await readJSON('./vite/packages/vite/package.json');

  console.log('Checking package jsons');
  checkPackages(pkgJson, vitePkgJson);

  console.log('Installing');
  await exec('pnpm install', { cwd: './vite/packages/vite' });

  console.log('Building');
  fixBuild('./vite/packages/vite/src/node/plugins/asset.ts');
  await exec('pnpm build', { cwd: './vite/packages/vite' });

  console.log('Moving folders');
  fs.renameSync('./vite/packages/vite/dist', './dist');
  fs.renameSync('./vite/packages/vite/bin', './bin');
  fs.renameSync('./vite/packages/vite/types', './types');
  fs.renameSync('./vite/packages/vite/index.cjs', './index.cjs');
  fs.renameSync('./vite/packages/vite/client.d.ts', './client.d.ts');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
