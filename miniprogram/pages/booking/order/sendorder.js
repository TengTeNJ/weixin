Page({
    data: {
      venueImage: '/images/home/banner1.png',
      venueName: 'Potent智能网球训练馆',
      venueAddress: '南通市崇川区桃园路7号南通体育会展中心2009-1',
      selectedTimes: [
        { date: '2025-07-30', court: '草地训练场', time: '9:00 – 9:30' },
        { date: '2025-07-30', court: '草地训练场', time: '9:00 – 9:30' }
      ],
      phoneNumber: '1885156878',
      subtotal: 100,
      noticeText: '预订成功后不可随意取消，如需更改请提前联系客服。'
    },
  
    onEditPhone() {
      wx.showModal({
        title: '修改手机号',
        content: '请联系客服修改手机号',
        showCancel: false
      })
    },
  
    onPay() {
      wx.showToast({
        title: '发起支付流程',
        icon: 'none'
      })
      wx.navigateTo({
        url: '/pages/booking/success/index'
    })
      // 调用云函数支付逻辑（伪代码）
      // wx.cloud.callFunction({
      //   name: 'payment',
      //   data: { total: this.data.subtotal, ... }
      // })
    }
  })
  