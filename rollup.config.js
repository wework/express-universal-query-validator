import babel from 'rollup-plugin-babel';

const pkgName = 'queryValidator';

export default {
  entry: 'src/index.js',
  targets: [
    {
      dest: `dist/${pkgName}.js`,
      sourceMap: `dist/${pkgName}.map.js`,
      format: 'cjs'
    },
  ],
  moduleId: pkgName,
  moduleName: pkgName,
  plugins: [
    babel({
      exclude: './node_modules/**',
      moduleIds: true,
      comments: false,

      // Custom babelrc for build
      babelrc: false,
      presets: [
        [ 'es2015', { 'modules': false } ]
      ],
      plugins: [
        'external-helpers'
      ]
    })
  ]
};
