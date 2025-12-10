Page({
    data: {
      videoUrl: ''
    },
  
    onLoad(options) {
      this.setData({
        videoUrl: decodeURIComponent(options.url)
      })
    },
  
    goBack() {
      wx.navigateBack()
    }
  })
  