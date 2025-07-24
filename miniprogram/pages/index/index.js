import pay from '../../api/pay';

Page({
    data: {
      bannerList: [
        '/images/home/banner1.png',
        '/images/home/banner2.png'
      ],
      menuList: [
        { icon: '/images/home/book.png', text: '订场' },
        { icon: '/images/home/train.png', text: '训练报告' },
        { icon: '/images/home/activity.png', text: '活动' },
        { icon: '/images/home/vip.png', text: '会员卡' }
      ],
      bookingList: [
        { date: '07-30', time: '今天', price: '￥40 起' },
        { date: '07-31', time: '明天', price: '￥40 起' },
        { date: '08-01', time: '周一', price: '￥40 起' },
        { date: '08-02', time: '周二', price: '￥40 起' }
      ],
      matchList: [
        '/images/home/activity1.png',
        '/images/home/activity1.png'
      ]
    },
    /**拨打电话 */
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: '12345678900'
      })
      pay.weiChatPay([1],'18168606832');
    },

    /**菜单点击 */
    menuClick(e){
        const { index } = e.currentTarget.dataset // 获取传递的数据
        console.log('索引:', index);
        if(index == 0){
            // 预订页面
            wx.navigateTo({
                url: '/pages/booking/home/index',
                complete() {
                }
              })
        }
    },

    /**比赛卡片点击 */
    onMatchClick(e) {
      wx.showToast({
        title: '点击了比赛卡片',
        icon: 'none'
      })
    },

  })
  