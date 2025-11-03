// utils/user.js
const USER_KEY = 'user_info';
const TOKEN_KEY = 'token';

/**
 *  userInfo: {
            avatarUrl: '',
            nickName: '',
            phoneNumber: '',
            balance: 100.00,
 }
 * @param {*} userInfo 
 */
// 存储用户信息（头像、昵称、openid 等）

function saveUserInfo(userInfo = {}) {
    try {
        wx.setStorageSync(USER_KEY, userInfo);
        getApp().globalData.userInfo = userInfo;
    } catch (e) {
        console.error('保存用户信息失败:', e);
    }
}

// 获取用户信息
function getUserInfo() {
    if (getApp().globalData.userInfo) {
        return getApp().globalData.userInfo;
    }
    try {
        const info = wx.getStorageSync(USER_KEY);
        getApp().globalData.userInfo = info;
        return info;
    } catch (e) {
        return null;
    }
}

// 存储 token
function saveToken(token) {
    wx.setStorageSync(TOKEN_KEY, token);
    getApp().globalData.token = token;
}

// 获取 token
function getToken() {
    return wx.getStorageSync(TOKEN_KEY) || '';
}

// 清除登录状态
function clearUserData() {
    wx.removeStorageSync(USER_KEY);
    wx.removeStorageSync(TOKEN_KEY);
    getApp().globalData.userInfo && (getApp().globalData.userInfo = null);
    getApp().globalData.token && (getApp().globalData.token = '');
}


/**
 * 检查登录状态
 * @param {boolean} showModal 是否显示提示模态框
 * @returns {boolean} 是否已登录
 */
function checkLogin(showModal = true,title) {
  const token =getToken();
  if (!token) {
    if (showModal) {
      wx.showModal({
        title: '提示',
        content: title || '请先进行授权登录',
        showCancel: false,
        success(res) {
        }
      });
    }
    return false;
  }
  return true;
}

module.exports = {
  checkLogin
};

module.exports = {
    saveUserInfo,
    getUserInfo,
    saveToken,
    getToken,
    clearUserData,
    checkLogin
};