import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import yaml from '@rollup/plugin-yaml'
import postcss from 'rollup-plugin-postcss'
import { string } from 'rollup-plugin-string'
import svelte from 'rollup-plugin-svelte'
import addStyle from './plugin/rollup-plugin-addstyle.js'
import userMeta from './plugin/rollup-plugin-user-meta.js'

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
  nodeResolve(),
  svelte({
    include: 'src/**/*.svelte',
    emitCss: true,
  }),
  postcss({ 
    extensions: ['.css', '.scss', '.sass'],
    extract: true,
    minimize: production
  }),
  typescript({ removeComments: production, tsconfig: 'tsconfig.json' }),
  commonjs(),
  userMeta({
    path: 'src/meta.yaml',
    version: true,
  }),
  addStyle(),
]

export default {
  input,
  output,
  plugins,
}
