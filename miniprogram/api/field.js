import { http } from '../utils/request';

/**
 * 场地相关API
 */
export default {
  /**
   * 获取场地价格列表
   * @returns {Promise<Object>} 响应数据
   * @returns {string} return.code - 状态码
   * @returns {string} return.msg - 消息
   * @returns {number} return.count - 总数
   * @returns {Array<Object>} return.data - 场地列表
   */
  getFieldPriceList() {
    return http.get('/api/fieldInfo/getFieldInfoPriceList',{},{'needToken':false});
  },

  /**
   * 获取场地详情
   * @param {number} fieldId - 场地ID
   * @returns {Promise<Object>} 响应数据
   */
  getFieldDetail(fieldId) {
    return http.get('/api/fieldInfo/getFieldDetail', { fieldId });
  }
};
