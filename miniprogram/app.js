// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
 // 云开发初始化
 wx.cloud.init({
    env: 'cloudbase-0gqm4lqt40d5b6b5', // 必填
    traceUser: true, // 可选，是否记录用户访问
  })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
