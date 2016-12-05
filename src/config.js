require('babel/polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  isDebug : false,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  googleMapKey : 'AIzaSyC4gQqD5iZsmbmknKIYR42sTfjcd8pl4aw',
  limitImageNumber : 5,
  limitImageSize : 5,
  pageSize : 9,
  iconPath : 'https://s3.eu-central-1.amazonaws.com/omzug.com/favicon/apple-icon.png',
  noImagePath : 'https://s3.eu-central-1.amazonaws.com/omzug.com/favicon/no-image.jpg',
  mainGifPath : "https://s3.eu-central-1.amazonaws.com/omzug.com/gif/main.gif",
  app: {
    title: '臻识',//head changeable
    description: '防伪通',
    introduction: '基于区块链技术的防伪认证解决方案',
    introduction2:'无法更改的网络信息证明',
    introductionEn : 'A verification platform based on Blockchain technology.',
    head: {
      titleTemplate: 'Zhensys : %s',
      meta: [
        {name: 'description', content: '基于区块链技术的防伪解决方案'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: '臻识防伪通'},
        {property: 'og:image', content: 'https://s3.eu-central-1.amazonaws.com/omzug.com/favicon/apple-icon.png'},
        {property: 'og:locale', content: 'zh_CN'},
        {property: 'og:title', content: 'Omzug'},
        {property: 'og:description', content: '基于区块链技术的防伪解决方案'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@hanwencheng'},
        {property: 'og:creator', content: '@hanwencheng'},
        {property: 'og:title', content: 'Fangweitong'},
        {property: 'og:image', content: 'https://s3.eu-central-1.amazonaws.com/omzug.com/favicon/apple-icon.png'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
