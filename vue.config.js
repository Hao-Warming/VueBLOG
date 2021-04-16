module.exports = {
    pwa: {
        iconPaths: {
            favicon32: 'favicon.ico',
            favicon16: 'favicon.ico',
            appleTouchIcon: 'favicon.ico',
            maskIcon: 'favicon.ico',
            msTileImage: 'favicon.ico'
        }
    },
    //webpack相关
    configureWebpack: {
        devtool: 'source-map'
    },
    //配置开发服务器
    devServer: {
        port: 8080,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            'api': {
                target: process.env.VUE_APP_BASE_API,
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/api': 'api'
                }
            }
        }
    }
};