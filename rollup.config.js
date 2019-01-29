/* eslint-disable no-console */
import license from 'rollup-plugin-license'
import babel from 'rollup-plugin-babel'
import {sizeSnapshot} from 'rollup-plugin-size-snapshot'
import {plugin as analyze} from 'rollup-plugin-analyzer'

const onAnalysis = ({bundleSize}) => {
  const limitBytes = 250e3

  if (bundleSize < limitBytes) return
  console.log(`ATTENTION: Bundle size exceeds ${limitBytes} bytes: ${bundleSize} bytes`)

  return process.exit(1)
}

const getPlugins = (format) =>
  [
    babel({extensions: ['.ts']}),
    license({
      banner: `
      <%= pkg.name %> <%= pkg.version %>
      <%= pkg.description %>
      <%= pkg.homepage %>
      Date: <%= moment().format('YYYY-MM-DD') %>
    `,
    }),
    sizeSnapshot(),
    analyze({onAnalysis}),
  ].filter(plugin => !!plugin)

export default [
  {
    input: 'src/index.ts',
    plugins: getPlugins('esm'),
    output: [
      {
        file: 'dist/uploadcare-uploader.esm.js',
        format: 'esm'
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: getPlugins('cjs'),
    output: [
      {
        file: 'dist/uploadcare-uploader.cjs.js',
        format: 'cjs'
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: getPlugins('umd'),
    output: [
      {
        file: 'dist/uploadcare-uploader.js',
        format: 'umd',
        name: 'UploadcareUploader'
      },
    ],
  },
]
