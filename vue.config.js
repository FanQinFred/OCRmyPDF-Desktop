const path = require('path')
const  Timestamp = new Date().getTime();
const TerserPlugin = require('terser-webpack-plugin');
// 去console插件
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      }
    },
    devServer: {
      disableHostCheck: true,
    },
    optimization: {
      minimize: process.env.NODE_ENV === 'production',
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log'], // 移除console
            },
          },
        }),
      ],
    },
    output: { 
      filename: 'js/[name].'+Timestamp+'.js',
      chunkFilename: 'js/[name].'+Timestamp+'.js'
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          "requestedExecutionLevel": "requireAdministrator"
        },
        "asar": false
      }
    }
  }
}