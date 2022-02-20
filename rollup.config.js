import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const pkg = require(path.resolve(__dirname, 'package.json'));
const outputName = path.basename(pkg.name);

console.log(outputName);
export default () => {
  return {
    input: 'src/index.ts',
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
    output: [
      {
        file: `dist/${outputName}.cjs.js`,
        format: 'cjs',
      },
      {
        file: `dist/${outputName}.esm.js`,
        format: 'esm',
      },
      {
        file: `dist/${outputName}.umd.js`,
        name: 'Epub',
        format: 'umd',
      },
    ],
  };
};
