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
        balance: 0.0,
        featureList: [{
                icon: '/images/mine/order.png',
                text: '我的订单'
            },
            {
                icon: '/images/mine/recharge.png',
                text: '会员充值'
            },
            {
                icon: '/images/mine/tennis.png',
                text: '我的卡券'
            },
            {
                icon: '/images/mine/study.png',
                text: '场馆指引'
            },
        ],
        listItems: [{
                icon: '/images/mine/records.png',
                title: '消费记录'
            },
            {
                icon: '/images/mine/phone.png',
                title: '合作加盟'
            },
            {
                icon: '/images/mine/message.png',
                title: '留言咨询'
            },
            {
                icon: '/images/mine/notice.png',
                title: '场馆须知'
            },
        ],
    },
    onUserTap() {
        const _this = this;
        if (!this.data.userInfo.nickName) {
            wx.getUserProfile({
                desc: '获取您的头像与昵称',
                success(res) {
                    console.error('123', res);
                    const {
                        avatarUrl,
                        nickName
                    } = res.userInfo;
                    _this.setData({
                        'userInfo.avatarUrl': avatarUrl,
                        'userInfo.nickName': nickName
                    });
                    wx.showToast({
                        title: '头像获取成功'
                    });
                },
                fail() {
                    wx.showToast({
                        title: '授权失败',
                        icon: 'none'
                    });
                }
            });
        } else if (!this.data.userInfo.phoneNumber) {
            // 用户已登录但未绑定手机号
            const query = wx.createSelectorQuery();
            query.select('.hidden-btn').boundingClientRect();
            query.exec(() => {
                wx.nextTick(() => {
                    wx.createSelectorQuery().select('.hidden-btn').node().exec(res => {
                        res[0].node.click?.(); // 触发按钮
                    });
                });
            });
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

    async onClickGrid(e) {
        const token = userUtils.getToken();
        if (!token) {
            wx.showModal({
                title: '提示',
                content: '请先进行授权登录',
                showCancel: false
            })
            return;
        }
        const _this = this;
        const {
            index
        } = e.currentTarget.dataset // 获取传递的数据
        console.error(index)

        if (index == 0) {
            // 我的订单
            // 预订页面
            wx.navigateTo({
                url: '/pages/booking/order/order',
                complete() {}
            })
        } else if (index == 1) {
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
        } else if (index === 3) {
            wx.navigateTo({
                url: '/pages/me/video/video?url=' + encodeURIComponent('https://weixin-1368395492.cos.ap-nanjing.myqcloud.com/video/guide.mp4')
            })
        } else {
            wx.showToast({
                title: '敬请期待',
                icon: 'none'
            })
        }
    },

    toNextPage(e) {
        const {
            index
        } = e.currentTarget.dataset // 获取传递的数据
        if(index == 1){
            wx.makePhoneCall({
                phoneNumber: '18094391931'
            })
            return;
        }
        wx.showToast({
            title: '敬请期待',
            icon: 'none'
        })
    },
})