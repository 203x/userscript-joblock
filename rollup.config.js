import resolve from '@rollup/plugin-node-resolve'
import yaml from '@rollup/plugin-yaml'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import { string } from 'rollup-plugin-string'
import userMeta from './plugin/rollup-plugin-user-meta.js'
import addStyle from './plugin/rollup-plugin-addstyle.js'
import svelte from 'rollup-plugin-svelte'

const production = !process.env.ROLLUP_WATCH

const name = 'joblock'

const input = 'src/main.ts'
const output = {
  file: production ? `dist/${name}.user.js` : `dist/${name}.bundle.js`,
  format: 'iife',
  sourcemap: !production, //true
}
const plugins = [
  yaml(),
  string({
    include: ['**/*.html', '**/*.svg'],
  }),
  resolve({
    customResolveOptions: {
      moduleDirectory: 'node_modules',
    },
  }),
  svelte({
    include: 'src/**/*.svelte',
    emitCss: true,
  }),
  postcss({ extract: true }),

  typescript({ tsconfig: 'tsconfig.json' }),
  commonjs(),
  userMeta({
    path: `src/meta.yaml`,
    version: true,
  }),
  addStyle(),
]

export default {
  input,
  output,
  plugins,
}
