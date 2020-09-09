const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 8080; // dev port

module.exports = {
  runtimeCompiler: true,
  publicPath: `//localhost:${port}`,
  outputDir: 'dist',
  filenameHashing: false,
  productionSourceMap:false,
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      },
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `zoe-calendar`,
      libraryTarget: 'umd',
      libraryExport: 'default'
    },
  },
};
