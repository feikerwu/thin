#!/usr/bin/env zx

const { fs, path } = require('zx');

// 检查node_modules是否存在
const nodeModulesDir = path.resolve(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesDir)) {
  console.log('node_modules not exists');
  process.exit(0);
}

// 分析当前 node_modules 的大小
const { stdout } = await $`du -sh ./node_modules/* | sort -nr | grep '\\dM'`;

const heavyPkgs = stdout
  .split('\n')
  .map((pkgStr) => {
    let [size, pkg] = pkgStr.split('\t');

    if (pkg) {
      pkg = pkg.replace(/(.*)node_modules\//, '');
    }
    console.log(pkg);
    return { size, pkg };
  })
  .filter((item) => item.pkg);

heavyPkgs.forEach(async ({ pkg }) => await $`yarn why ${pkg}`);
// | sort -nr | grep '\dM.'
// console.log(text);
