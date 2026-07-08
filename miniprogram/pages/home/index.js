import account from '../../api/account'
import userUtils from '../../utils/user'
import stores from '../../api/stores'
import { get } from '../../utils/storage';
Page({
    data: {
        storeStatusMap: {
            1: '已关店',
            2: '即将开业',
            3: '营业中',
            4: '休息中'
        },
        balance: 0.00,
        userInfo: {
            avatarUrl: '',
            nickName: '',
            phoneNumber: '',
            balance: 0.00,
            memberId: 0
        },
        venue: {},
    },

       // 分享配置
  onShareAppMessage() {
    return {
      title: 'Potent智能网球训练馆', // 默认分享标题（可选）
      path: '/pages/index/index', // 默认当前页面路径（可选）
      imageUrl: '/images/home/icon.png', // 自定义分享图片（可选）
    };
  },
    // 初始化函数
    async onLoad() {
        const userInfo = userUtils.getUserInfo();
        this.setData({
            userInfo: userInfo
        })
        // 获取门信息
        this.getStoreInfo();
        // 退出登录监听
        this.onListenLogout();
    },

    // 监听登录退出状态
    onListenLogout(){
        getApp().eventBus.on('logout', () => {
            // 这里写页面刷新逻辑
            const userInfo = userUtils.getUserInfo();
            this.setData({
                userInfo: userInfo
            })
          });
    },

    onShow() {
        if(!getApp().globalData.storeId){
            return;
        }
        this.getAccountData();
    },

    // 获取门店信息
    getStoreInfo() {
        const _this = this;
        // 获取位置信息 请求
        wx.getFuzzyLocation({
            type: 'wgs84',
            async success(res) {
                console.log("经度：", res.longitude)
                console.log("纬度：", res.latitude)
            _this.getStoreAndAccountData(res.longitude,res.latitude);
            },
            fail(err) {
                _this.getStoreAndAccountData();
            }
        });
    },

    async getStoreAndAccountData(longitude,latitude){
        const storesData = await stores.getStoreList(longitude, latitude);
        if (Array.isArray(storesData) && storesData.length > 0)
            this.setData({
                venue: {
                    ...storesData[0],
                },
            })
        getApp().globalData.storeId = storesData[0].id;
        getApp().globalData.store = storesData[0];
        // 更新用户下的余额信息
        this.getAccountData();
    },

    // 账户信息
    async getAccountData() {
        let _result = await account.getAccountData();
        // 更新用户信息
        let userInfo = userUtils.getUserInfo();
        userInfo.nickName = _result.data.nickName;
        userInfo.avatarUrl = _result.data.avatar;
        userInfo.phoneNumber = _result.data.accountNo;
        userUtils.saveUserInfo(userInfo)
        this.setData({
           userInfo:userInfo
        });
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
        // 获取账号信息
        this.getAccountData();
    },
    /* 去门店列表 */
    goToVenueList() {
        const _this = this;
        wx.navigateTo({
            url: '/pages/stores/stores',
            success(res) {
                const eventChannel = res.eventChannel; // 获取事件通道
                eventChannel.on('item', (data) => {
                    console.log('data', data); // 输出从页面B传递过来的数据
                    // data 和之前 venue 的引用一样（你 stores 页面 emit 的对象被复用了），渲染层不会认为它变了。
                    _this.setData({
                        venue: {
                            ...data
                        } // 需要copy一份，不能直接——this.setData({  venue:data})   
                    })
                    getApp().globalData.storeId = data.id;
                    getApp().globalData.store = data;
                    // 更新用户下的余额信息
                    _this.getAccountData();
                });
            }
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

    // 预订页面
    goToBooking() {
        if (userUtils.checktoOtherMP(this.data.venue.wxAppId)) {
            return;
        }
        // 预订页面
        const app = getApp();
        if (!app.globalData.checkLogin()) {
            return; // 未登录则停止执行
        }
        wx.navigateTo({
            url: `/pages/booking/home/index?storeId=${this.data.venue.id}`,
        })
    },

    // 充值页面
    goToRecharge() {
        if (userUtils.checktoOtherMP(this.data.venue.wxAppId)) {
            return;
        }
        // 预订页面
        const app = getApp();
        if (!app.globalData.checkLogin()) {
            return; // 未登录则停止执行
        }
        wx.navigateTo({
            url: `/pages/coupons/home?storeId=${this.data.venue.id}`,
            // url: '/pages/me/recharge/recharge',
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

    // 团课活动
    goToGroupLesson() {
        wx.navigateTo({
            url: '/pages/common/empty'
        });
    },

    // 私教课预定
    goToPrivateCoach() {
        wx.navigateTo({
            url: '/pages/common/empty'
        });
    },
});