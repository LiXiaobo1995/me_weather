// app.js
App({
  onLaunch() {
    // require SDK
    require('./sdk-v1.1.2')
    // 初始化 SDK
    let clientID = '75205137f9afd9aa9d67'
    wx.BaaS.init(clientID)
  }
})