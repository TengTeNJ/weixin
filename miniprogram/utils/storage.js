// utils/storage.js

function set(key, value) {
    try {
      wx.setStorageSync(key, value);
    } catch (e) {
      console.error('存储失败:', key, e);
    }
  }
  
  function get(key) {
    try {
      return wx.getStorageSync(key);
    } catch (e) {
      return null;
    }
  }
  
  module.exports = {
    set,
    get
  };
  