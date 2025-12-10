import {
    http
} from '../utils/request'
import {
    set
} from '../utils/storage'
import {
    STORAGE_KEYS
} from '../utils/constants'
import utils from '../utils/util'
/**
 * 相关API
 */
export default {
    /**
     * getWxOpenId
     */
    async getWxOpenId() {
        try {
            const code = await utils.getLoginCode(); // 等待 IP 获取
            console.log('获取到 loginCode:', code);
            const res = await http.get('/api/login/getWxOpenId', {
                code
            });
            // 存储openId
            set(STORAGE_KEYS.OPENID, res.data.openId)
            return res;
        } catch (err) {
            // 可选：继续请求或者返回错误
            return await http.get('/api/login/getWxOpenId', {
                code
            });
        }
    },

    async weixinPhoneLogin(encryptedData, iv, code) {
        try {
            const res = await this.getWxOpenId();
            console.warn('res123', res);
            const {
                sessionKey,
                openId
            } = res.data;
            return await http.post('/api/login/wxLoginByTel', {
                secretKey: sessionKey,
                encryptedData,
                iv,
                openId,
                code
            });
        } catch (err) {
            return await http.post('/api/login/wxLoginByTel', {
                encryptedData,
                iv,
            });
        }
    },

    /**
     * 获取用户数据
      * {
   "avatar": "string",
   "birthday": "string",
   "country": "string",
   "memberId": 0,
   "nickName": "string",
   "usableMoney": 0
    }
      */
    async getAccountData() {
        return await http.get('/api/member/index', {storeId:getApp().globalData.storeId}, {
            'needToken': true
        });
    },

    /**
     * 更新用户信息
     * @param {*} nickName 昵称
     * @param {*} avatar 头像地址
     */
    async updateUserInfo(nickName,avatar) {
        return await http.post('/api/member/update', {nickName,avatar}, {
            'needToken': true
        });
    },


};