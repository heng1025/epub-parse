import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/index.umd.js',
      name: 'Epub',
      format: 'umd',
    },
  ],
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    commonjs({
      include: 'node_modules/**',
      sourceMap: false,
    }),
  ],
};
