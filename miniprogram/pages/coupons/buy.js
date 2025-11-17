import recharge from '../../api/recharge'
Page({
    data: {
        cardInfo: {
            name: '5000元储值卡',
            scope: '腾特AR智能训练馆',
            project: '预约订场',
            expireDate: '不限制'
        },
        couponText: '暂无可用优惠券',
        totalAmount: 100,
        configObj:{}
    },

    onLoad(options) {
        // 可以从上个页面传参数，例如 options.cardId
        const obj = JSON.parse(decodeURIComponent(options.data));
        if (obj != undefined) {
            this.setData({
                configObj:obj,
                totalAmount:obj.rechargeMoney
            })
        }
    },

    onSelectCoupon() {
        wx.showToast({
            title: '暂无可用优惠券',
            icon: 'none'
        })
        // 如果以后有优惠券选择页，可以改成：
        // wx.navigateTo({ url: '/pages/couponSelect/couponSelect' })
    },

    async onPayConfirm() {
        const _this = this;
        if (!this.data.configObj) return;
        let _result = await recharge.prepayForRecharge(this.data.configObj.confId,this.data.configObj.rechargeMoney)
        console.error('_result=',_result)
        wx.requestPayment({
          ..._result.data,
          success(res) {
              console.log('支付成功',res)
              const eventChannel = _this.getOpenerEventChannel();
              eventChannel.emit('refreshPage');
              wx.navigateBack();
          },
          fail(error) {
              console.error('error',error)
              const eventChannel = _this.getOpenerEventChannel();
              eventChannel.emit('refreshPage');
              wx.navigateBack()
          }
      })

        wx.showModal({
            title: '确认支付',
            content: `确认支付 ￥${this.data.totalAmount} 吗？`,
            success: (res) => {
                if (res.confirm) {
                    wx.showLoading({
                        title: '支付中...'
                    })
                    setTimeout(() => {
                        wx.hideLoading()
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success'
                        })
                        // 支付成功逻辑，如跳转订单页
                        // wx.redirectTo({ url: '/pages/orderResult/orderResult' })
                    }, 1500)
                }
            }
        })
    }
})