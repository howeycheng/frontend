const port = process.env.port || process.env.npm_config_port || 80 // 端口

module.exports = {
    // 输出目录
    assetsDir: 'static',
    // webpack-dev-server 相关配置
    devServer: {
        // 指定使用的host，放开外部访问
        host: '0.0.0.0',
        port: port,
        open: true,
        proxy: {
            // detail: https://cli.vuejs.org/zh/config/#devserver-proxy
            [process.env.VUE_APP_BASE_API]: {
                target: `http://localhost:8090`,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        },
        disableHostCheck: true
    },
};