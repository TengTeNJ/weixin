const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 获取 openid（通过云函数）
async function getOpenId() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getOpenId' // 云函数名
      });
      const openid = res.result.openid;
      console.log("获取到 openid:", openid);
      return openid;
    } catch (err) {
      console.error("获取 openid 失败:", err);
      return null;
    }
  }
  
  // 获取本地局域网 IP
  function getLocalIP() {
    return new Promise((resolve, reject) => {
      wx.getLocalIPAddress({
        success(res) {
          resolve(res.localip);
        },
        fail(err) {
          reject(err);
        }
      });
    });
  }  


// 获取格式化时间字符串 2025-07-24 15:30:55
function getFormattedTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

module.exports = {
  formatTime,
  getOpenId,
  getLocalIP,
  getFormattedTime
};
