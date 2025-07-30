import pay from '../../api/pay';
import field from '../../api/field'
Page({
    data: {
        bannerList: [
            '/images/home/banner1.png',
            '/images/home/banner2.png'
        ],
        menuList: [{
                icon: '/images/home/book.png',
                text: '订场'
            },
            {
                icon: '/images/home/train.png',
                text: '训练报告'
            },
            {
                icon: '/images/home/activity.png',
                text: '活动'
            },
            {
                icon: '/images/home/vip.png',
                text: '会员卡'
            }
        ],
        bookingList: [{
            bookDate: '07-30',
            weekDate: '今天',
            periodPrice: '￥40 起'
        }, ],
        matchList: [
            '/images/home/activity1.png',
            // '/images/home/activity1.png'
        ]
    },

    async onLoad(option) {
        this.getDayBestOfferData()
    },

    /**
     *获取最近七天的最优惠的场地数据
     */
    async getDayBestOfferData() {
        const res = await field.getDayBestOfferData();
        const newList = res.data.indexBookVoList.map(item => {
            return {
                ...item,
                bookDate: item.bookDate.length > 5 ?
                    item.bookDate.slice(-5) :
                    item.bookDate
            };
        });
        this.setData({
            bookingList: newList
        })
    },
    /**拨打电话 */
    async callPhone() {
        wx.makePhoneCall({
            phoneNumber: '0513-81185608'
        })
    },

    /**菜单点击 */
    menuClick(e) {
        const {
            index
        } = e.currentTarget.dataset // 获取传递的数据
        console.log('索引:', index);
        if (index == 0) {
            // 预订页面
            const app = getApp();
            if (!app.globalData.checkLogin()) {
                return; // 未登录则停止执行
              }
            wx.navigateTo({
                url: '/pages/booking/home/index',
                complete() {}
            })
        } else {
            wx.showToast({
                title: '敬请期待',
                icon: 'none'
            })
        }
    },

    /**
     * 去选择场地页面
     */
    toFieldPage(e) {
        // 预订页面
        const app = getApp();
        if (!app.globalData.checkLogin()) {
            return; // 未登录则停止执行
          }
        const {
            index
        } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/booking/home/index?fieldIndex=${index}`,
        })
    },

    /**比赛卡片点击 */
    onMatchClick(e) {
        // wx.showToast({
        //     title: '2025江苏省腾特杯网球邀请赛',
        //     icon: 'none'
        // })
    },

})