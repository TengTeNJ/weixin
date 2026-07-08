const {
    checkLogin
} = require('./utils/user');

import userUtils from './utils/user'
(function () {
    const originPage = Page;
    Page = function (pageConfig) {
      // 如果页面没定义 onShareAppMessage，就给一个默认的
      if (!pageConfig.onShareAppMessage) {
        pageConfig.onShareAppMessage = function (res) {
          return {
            title: "Potent智能网球训练馆", // 默认分享标题
            path: "/" + this.route, // 当前页面路径
            imageUrl: './images/home/icon.png' // 可选：默认分享图
          };
        };
      }
      originPage(pageConfig);
    };
})();
// app.js
App({
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // 云开发初始化
        wx.cloud.init({
            env: 'cloudbase-0gqm4lqt40d5b6b5', // 必填
            traceUser: true, // 可选，是否记录用户访问
        })
        // 将检查登录方法挂载到全局
        this.globalData.checkLogin = checkLogin;

        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          console.log('hasUpdate:', res.hasUpdate)
        })
    
        updateManager.onUpdateReady(function () {
          updateManager.applyUpdate()
        })
    
        updateManager.onUpdateFailed(function () {
          wx.showModal({
            title: '更新失败',
            content: '请删除小程序重新进入'
          })
        })
    },


    globalData: {
        userInfo: null,
        token: '',
        checkLogin: null,
        storeId: null,
        store: {},
        version: '26.04.28' // 直接写在这里
    },
    // 简易事件总线
    eventBus: {
        events: {},
        on(name, fn) {
            if (!this.events[name]) {
                this.events[name] = [];
            }
            this.events[name].push(fn);
        },
        emit(name, data) {
            if (this.events[name]) {
                this.events[name].forEach(fn => fn(data));
            }
        }
    }
})
