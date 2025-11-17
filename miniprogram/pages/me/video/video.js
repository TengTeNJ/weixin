Page({
    data: {
      videoUrl: ''
    },
  
    onLoad(options) {
        console.error('options.url',options.url)
      this.setData({
        videoUrl: decodeURIComponent(options.url)
      })
    },
  
    goBack() {
      wx.navigateBack()
    }
  })
  