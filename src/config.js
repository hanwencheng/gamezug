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
    title: 'Aeria Games',//head changeable
    description: 'Gaming center',
    introduction: 'a game center ',
    introduction2:'could be fun',
    introductionEn : 'A game center for testing user abilities',
    head: {
      titleTemplate: 'Game Center : %s',
      meta: [
        {name: 'description', content: 'A game center for testing user abilities'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'GameZug'},
        {property: 'og:image', content: 'https://s3.eu-central-1.amazonaws.com/omzug.com/favicon/apple-icon.png'},
        {property: 'og:locale', content: 'zh_CN'},
        {property: 'og:title', content: 'Omzug'},
        {property: 'og:description', content: 'A game center for testing user abilities'},
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
