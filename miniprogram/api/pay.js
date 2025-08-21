import {
    http
} from '../utils/request'

import account from './account'

import utils from '../utils/util'
import userUtils from '../utils/user'
import {
    STORAGE_KEYS
} from '../utils/constants'
import {
    get
} from '../utils/storage'

/**
 * 支付相关API
 */
export default {
    /**
     * 支付接口
     */
    async weiChatPay(priceIdList, bookDate, total) {
        try {
            const ip = await utils.getLocalIP(); // 等待 IP 获取
            console.log('获取到 IP:', ip);
            // 3. 获取 openid
            const wxOpenId = get(STORAGE_KEYS.OPENID);
            // 获取手机号
            const userInfo = userUtils.getUserInfo();
            var phone = '';
            if (userInfo) {
                phone = userInfo['phoneNumber'] || ''
            }
            let payType = 0; // 支付类型(0微信支付，1余额支付, 2组合支付)
            // 获取用户余额
            let _userData = await account.getAccountData();
            let usableMoney = _userData.data.usableMoney;
            if (usableMoney >= total) payType = 1; // 余额支付
            if (usableMoney > 0 && usableMoney < total) {
                payType = 2; // 组合支付
            }
            // 请求接口，携带 ip 和时间支付请求
            return http.post('/api/pay/prepay', {
                clientIp: ip,
                bookDate: bookDate,
                priceIdList,
                wxOpenId,
                'telephone': phone,
                payType
            }, {
                'needToken': true
            });

        } catch (err) {
            console.error('获取 IP 失败:', err);
            // 可选：继续请求或者返回错误
            return http.post('/api/pay/prepay', {
                priceIdList: priceIdList
            }, {
                'needToken': true
            });
        }
    }


};