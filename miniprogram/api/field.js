import { http } from '../utils/request';

/**
 * 场地相关API
 */
export default {
  /**
   * 获取场地价格列表
   * @param {日期} bookDate 
   */
  getFieldPriceList(bookDate,storeId) {
    return http.get('/api/fieldInfo/getFieldInfoPriceList',{bookDate,storeId},{'needToken':false});
  },

  /**
   * 获取场地详情
   * @param {number} fieldId - 场地ID
   * @returns {Promise<Object>} 响应数据
   */
  getFieldDetail(fieldId,bookDate) {
    return http.get('/api/fieldInfo/getFieldPriceListByFieldId', { fieldId,bookDate });
  },

/**
 * 获取最近七天的最优惠的场地数据
 */
  getDayBestOfferData(){
    return http.get('/api/index/home', {});
  }
};
