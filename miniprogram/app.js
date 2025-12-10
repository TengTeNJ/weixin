const {
    checkLogin
} = require('./utils/user');

import userUtils from './utils/user'
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
        version: '12.10' // 直接写在这里
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