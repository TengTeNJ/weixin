import {
    http
} from '../utils/request'

import utils from '../utils/util'
/**
 * 支付相关API
 */
export default {
    /**
     * 支付接口
     * @returns {Promise<Object>} 响应数据
     * @returns {string} return.code - 状态码
     * @returns {string} return.msg - 消息
     * @returns {number} return.count - 总数
     * @returns {Array<Object>} return.data - 场地列表
     */
    async weiChatPay(priceIdList, telephone) {
        try {
            const ip = await utils.getLocalIP(); // 等待 IP 获取
            console.log('获取到 IP:', ip);

            // 获取当前时间
            const formatDate = utils.getFormattedTime();
            console.log('当前时间:', formatDate);

            // 3. 获取 openid
            const openid = await utils.getOpenId();
            // 请求接口，携带 ip 和时间（如果需要）
            return http.post('/api/pay/prepay', {
                clientIp: ip,
                bookDate: formatDate,
                priceIdList,
                telephone,
                openid,
                'memberId':'1722478624'
            });

        } catch (err) {
            console.error('获取 IP 失败:', err);
            // 可选：继续请求或者返回错误
            return http.post('/api/pay/prepay', {
                priceIdList: priceIdList
            });
        }
    }


};
