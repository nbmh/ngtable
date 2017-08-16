export default {
  entry: 'dist/app.js',
  dest: 'bundles/core.umd.js',
  format: 'umd',
  sourceMap: 'inline',
  moduleName: 'ngtable',
  globals: {
    '@angular/core': 'ng.core'
  }
};