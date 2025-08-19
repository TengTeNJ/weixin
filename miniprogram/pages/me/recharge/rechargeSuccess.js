Page({
    data: {
      amount: 0,
      bonus: 0
    },
  
    onLoad(options) {
      this.setData({
        amount: options.amount || 0,
        bonus: options.bonus || 0
      });
    },
  
    goHome() {
      wx.reLaunch({
        url: '/pages/index/index' // 你的首页路径
      });
    }
  });
  