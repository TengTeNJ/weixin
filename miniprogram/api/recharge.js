import { http } from '../utils/request';
import utils from '../utils/util'
import {STORAGE_KEYS} from '../utils/constants'
import {get} from '../utils/storage'
import account from '../api/account'
/**
 * 订单相关API
 */
export default {
    /**
     * 查询充值配置列表-支持分页
     * @param {当前页码} page 
     */
    getList(page) {
      return http.get('/api/recharge/getList',{page,limit:50},{'needToken':true});
    },
  /**
   * 预充值接口
   * @param rechargeConfId*	integer($int32)充值配置编号
   * rechargeMoney*	number
   充值金额（自定义金额）
   */
  async prepayForRecharge(rechargeConfId,rechargeMoney){
    const clientIp = await utils.getLocalIP(); // 等待 IP 获取
    console.log('获取到 IP:', clientIp);

    console.error('getApp().globalData.storeId',getApp().globalData.storeId);

    // 获取 openid
    const wxOpenId = get(STORAGE_KEYS.OPENID);
      return http.post('/api/pay/prepayForRecharge',{clientIp,rechargeConfId,rechargeMoney,wxOpenId},{'needToken':true});
    },

    /**
     * 充值接口
     */
    async recharge(rechargeConfId,rechargeMoney){
        // 先获取用户数据
        let _userInfo = await account.getAccountData();
        let memberId = _userInfo.data.memberId ;  // 用户的会员号
        let usableMoney = _userInfo.data.usableMoney ;  // 用户的余额
        // 调用预充值接口

        let _orderData = await this.prepayForRecharge(rechargeConfId,rechargeMoney);

    }

};