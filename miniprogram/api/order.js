import { http } from '../utils/request';

/**
 * 订单相关API
 */
export default {
  /**
   * 获取订单列表
   * @param {当前页码} page 
   * @param {*订单状态，：9全部，0支付中1支付完成2支付取消} orderStatus 
   */
  getOrderList(page,orderStatus) {
    return http.post('/api/order/list',{page,orderStatus,limit:50},{'needToken':true});
  },
/**
 * 取消订单接口
 * @param {*订单编号} orderNo 
 */
  cancelOrder(orderNo){
    return http.post('/api/order/cancel',{orderNo},{'needToken':true});
  }

};
