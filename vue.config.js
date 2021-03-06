module.exports = {
    configureWebpack: {

    },
    devServer: {
        https: true
    },

    chainWebpack: config => {

        // GraphQL Loader
        config.module
            .rule('glslify')
            .test(/\.(glsl|vs|fs|vert|frag)$/)
            .use('raw-loader')
            .loader('raw-loader')
            .end()
            .use('glslify-loader')
            .loader('glslify-loader')
            .end()
            .rule('model')
            .test(/\.(glb)$/)
            .use('raw-loader')
            .loader('raw-loader')
            .end()
        // Add another loader
    },

}