import account from '../../api/account'
import userUtils from '../../utils/user'
Page({
    data: {
        userInfo: {
            avatarUrl: '',
            nickName: '',
            phoneNumber: '',
            balance: 100.00,
            memberId: 0
        },
        venue: {
            name: "腾特智能AR训练馆上海静安店",
            status: "营业中",
            distance: 12.9,
            image: "/images/home/banner2.png"
        },
        user: {
            avatar: "/assets/avatar.jpg",
            name: "Tommy",
            phone: "18851568978",
            balance: 100.00
        }
    },

    // 初始化函数
    onLoad() {
        const userInfo = userUtils.getUserInfo();
        console.error('userInfo', userInfo)
        this.setData({
            userInfo: userInfo
        })
    },

    onShow() {
        this.getAccountData();
    },

    async getAccountData() {
        let _result = await account.getAccountData();
        this.setData({
            balance: _result.data.usableMoney,
        });
    },

    // 点击头像
    onChooseAvatar(e) {
        const app = getApp();
        if (!app.globalData.checkLogin()) {
            return;
        }
        const {
            avatarUrl
        } = e.detail // 头像临时路径
        this.setData({
            'userInfo.avatarUrl': avatarUrl
        })
        userUtils.saveUserInfo(this.data.userInfo);
        // 上传头像到服务器（可选）
        // wx.uploadFile({ url: 'your_api', filePath: avatarUrl, name: 'avatar' })
    },

    // 获取手机号
    async onGetPhoneNumber(e) {
        const {
            code,
            encryptedData,
            iv
        } = e.detail;
        if (!code) {
            wx.showToast({
                title: '用户取消授权',
                icon: 'none'
            });
            return;
        }
        console.error('code=', code)
        const result = await account.weixinPhoneLogin(encryptedData, iv, code);
        this.setData({
            'userInfo.avatarUrl': result.data.avatar,
            'userInfo.nickName': result.data.nickName,
            'userInfo.phoneNumber': result.data.accountNo || result.data.nickName
        });
        // 存储用户信息
        userUtils.saveUserInfo(this.data.userInfo)
        // 获取token 并进行存储
        const token = result.data.memberToken;
        userUtils.saveToken(token);
    },
    /* 导航方法 */
    goToVenueList() {
        wx.navigateTo({
            url: '/pages/stores/stores'
        });
    },

    goToVenueDetail() {
        wx.navigateTo({
            url: '/pages/venueDetail/venueDetail'
        });
    },

    goToProfile() {
        wx.navigateTo({
            url: '/pages/profile/profile'
        });
    },

    goToBooking() {
        // 预订页面
        const app = getApp();
        if (!app.globalData.checkLogin()) {
            return; // 未登录则停止执行
        }
        wx.navigateTo({
            url: '/pages/booking/home/index',
        })
    },

    goToRecharge() {
        // 预订页面
        const app = getApp();
        if (!app.globalData.checkLogin()) {
            return; // 未登录则停止执行
        }
        wx.navigateTo({
            url: '/pages/me/recharge/recharge',
            events: {
                refreshPage: () => {
                    //TODO 充值完成后 重新调用接口 刷新页面
                    wx.showToast({
                        title: '充值成功',
                        icon: 'success'
                    })
                    setTimeout(() => {
                        // 刷新余额数据
                        _this.getAccountData();
                    }, 1500);
                }
            },
            complete() {}
        })
    },

    goToGroupLesson() {
        wx.navigateTo({
            url: '/pages/groupLesson/groupLesson'
        });
    },

    goToPrivateCoach() {
        wx.navigateTo({
            url: '/pages/privateCoach/privateCoach'
        });
    }
});