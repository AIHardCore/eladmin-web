'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const CompressionPlugin = require('compression-webpack-plugin')
const SmarterQiniuWebpackPlugin = require('smarter-qiniu-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
let cdn = { css: [], js: [] }
let externals = {}
if (isProd) {
  // 如果是生产环境 就排除打包 否则不排除
  externals = {
    // key(包名) / value(这个值 是 需要在CDN中获取js, 相当于 获取的js中 的该包的全局的对象的名字)
    // 'vue': 'Vue', // 后面的名字不能随便起 应该是 js中的全局对象名
    // 'vue-router': 'VueRouter',
    // 'vant': 'Vant',
    // 'axios': 'axios'
  }
  cdn = {
    css: [
      // process.env.VUE_APP_PUBLIC_PATH_PROD + 'index.css' // 提前引入elementUI样式
    ], // 放置css文件目录
    js: [
      // process.env.VUE_APP_PUBLIC_PATH_PROD + 'vue.min.js', // vuejs
      // process.env.VUE_APP_PUBLIC_PATH_PROD + 'vue.router.min.js', // vue-router
      // process.env.VUE_APP_PUBLIC_PATH_PROD + 'vant.min.js', // vant
      // process.env.VUE_APP_PUBLIC_PATH_PROD + 'axios.min.js' // vant
    ] // 放置js文件目录
  }
}

const name = defaultSettings.title // 网址标题
const port = 8013 // 端口配置

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  // hash 模式下可使用
  // publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
  // 生产环境下替换路径为cdn路径
  publicPath: isProd ? process.env.VUE_APP_PUBLIC_PATH_PROD + require('./package.json').version + (process.env.ENV === 'test' ? '_test' : '') : '/',
  // publicPath: '/',
  outputDir: 'dist/' + require('./package.json').version + (process.env.ENV === 'test' ? '_test' : ''),
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'api'
        }
      },
      '/app': {
        target: process.env.VUE_APP_BASE_APP_API,
        changeOrigin: true,
        pathRewrite: {
          '^/app': 'app'
        }
      },
      '/auth': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/auth': 'auth'
        }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    plugins: [
      // https://www.ydyno.com/archives/1260.html 使用gzip解压缩静态文件
      new CompressionPlugin({
        test: /\.(js|css|html)?$/i, // 压缩文件格式
        filename: '[path].gz[query]', // 压缩后的文件名
        algorithm: 'gzip', // 使用gzip压缩
        minRatio: 0.8 // 压缩率小于1才会压缩
      }),
      new SmarterQiniuWebpackPlugin()
    ],
    // 排除框架
    externals: externals
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    // 生产环境下使用CDN
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })
    }
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}
