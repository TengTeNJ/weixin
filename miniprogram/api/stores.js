import {
    http
} from '../utils/request';
export default {
    async getCityList() {
       const res = await http.get('/api/storeInfo/getCityList', null, {
            'needToken': false
        });
        if (res.code === '0'){
            const cities = (res.data || []).map(item => ({
                id: item.cityId,
                code: item.cityCode,
                name: item.cityName,
                provinceCode: item.provinceCode,
                latitude: item.lat,
                longitude: item.lng
              }));
             return(cities);
        }else{
            return(null) 
        }
    },
    async getStoreList(
        localLng,
        localLat,
        orderByType = 1,
        cityCode,
        page = 1,
        limit = 20
    ) {
          // 只把非 null/undefined 的字段写入 params
          const params = {
            page,
            limit,
            ...(localLng != null && { localLng }),
            ...(localLat != null && { localLat }),
            ...(orderByType != null && { orderByType }),
            ...(cityCode != null && { cityCode }),
          };
        const res = await http.get('/api/storeInfo/getStoreList', params, {
             'needToken': false
         });
         if (res.code === '0'){
             const stores = (res.data || []).map(item => ({
                id: item.storeId,
                name: item.storeName,
                contact: item.storeContact,
                tel: item.contactTel,
                latitude: item.storeLat,
                longitude: item.storeLng,
                address: item.totalAddress,
                image: item.storeImage,
                distance: item.distanceStr,
                distanceValue: item.distanceBd,
                remark: item.storeRemark,
                closeTime: item.closeTime,
                storeStatus: item.storeStatus,
                wxAppId: item.wxAppId,
                storeVideo: item.storeVideo
               }));
              return(stores);
         }else{
            return(null) 
         }
     },
}