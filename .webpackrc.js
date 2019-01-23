const path = require('path');

export default {
  entry: 'src/index.ts',
  sass: {},
  publicPath: '/',
  hash: true,
  devtool: "inline-source-map",
  alias: {
    '@': `${__dirname}/src/`,
    'views': `${__dirname}/src/views/`,
    'base-components': `${__dirname}/src/base-components/`,
    'components': `${__dirname}/src/components/`,
    'models': `${__dirname}/src/models/`,
    'services': `${__dirname}/src/services/`,
    'static': `${__dirname}/src/static/`,
    'images': `${__dirname}/src/static/images/`,
    'scss': `${__dirname}/src/static/scss/`,
    'config': `${__dirname}/src/config/`,
    'utils': `${__dirname}/src/utils/`,
    'types': `${__dirname}/src/types/`,
    'high-order-components': `${__dirname}/src/high-order-components/`
  },
  browserslist: [
    "last 5 versions",
    "Android >= 4.0",
    "iOS >= 8",
    "safari > 8",
    "not ie <= 8"
  ],
  extraBabelPlugins: [
    'transform-decorators-legacy',
    ['import', { 'libraryName': 'antd-mobile', 'style': 'css' }]
  ]
}
