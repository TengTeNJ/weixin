import userUtils from '../../../utils/user'
import pay from '../../../api/pay'
Page({
    data: {
        venueImage: '/images/home/banner1.png',
        venueName: 'Potent智能网球训练馆',
        venueAddress: '南通市崇川区桃园路7号南通体育会展中心2009-1',
        selectedTimes: [],
        phoneNumber: '-',
        subtotal: 0,
        noticeText: '预订成功后不可随意取消，如需更改请提前联系客服。'
    },

    onEditPhone() {
        wx.showModal({
            title: '修改手机号',
            content: '请联系客服修改手机号',
            showCancel: false
        })
    },
    onLoad(options) {
        // 接收传递过来的数据
        const dataParam = options.data;
        const dataArray = JSON.parse(decodeURIComponent(dataParam));
        console.log('接收到的数组:', dataArray);
        // 计算总额
        const total = dataArray.reduce((sum, item) => sum + item.periodPrice, 0);
        console.log(total);
        // 获取手机号
        const phoneNumber = userUtils.getUserInfo().phoneNumber || '-';
        // 刷新页面
        this.setData({
            selectedTimes: dataArray,
            subtotal: total,
            phoneNumber
        })
    },

    async onPay() {
        const priceIds = this.data.selectedTimes.map(item => (
            item.priceId));
        console.error('priceIds', priceIds)
        // 调用后台接口
        const res = await pay.weiChatPay(priceIds);
        const {
            nonceStr,
            paySign,
            signType
        } = res.data;
        const timestamp = String(Math.floor((Date.now() + 8 * 60 * 60 * 1000) / 1000));
        const _package = res.data.package;
        console.error({
            nonceStr: nonceStr,
            package: _package,
            paySign: paySign,
            timeStamp: timestamp
        })
        // 拉起收银台
        wx.requestPayment({
            nonceStr: nonceStr,
            package: _package,
            paySign: paySign,
            timeStamp: timestamp,
            success(res) {
                wx.navigateTo({
                    url: '/pages/booking/success/index'
                })
            },
            fail(res) {}
        })

        // 调用云函数支付逻辑（伪代码）
        // wx.cloud.callFunction({
        //   name: 'payment',
        //   data: { total: this.data.subtotal, ... }
        // })
    }
})