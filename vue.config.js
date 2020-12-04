// https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html
module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
      }
    }
  },
  configureWebpack: {
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      }
    },
    plugins: []
  }
}
