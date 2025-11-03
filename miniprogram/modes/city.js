// models/city.js
class City {
    constructor({ cityId, cityCode, cityName, provinceCode, lat, lng }) {
      this.id = cityId;
      this.code = cityCode;
      this.name = cityName;
      this.provinceCode = provinceCode;
      this.latitude = lat;
      this.longitude = lng;
    }
  
    // 可添加一些业务逻辑函数，例如：
    getFullName() {
      return `${this.provinceCode}-${this.name}`;
    }
  }
  
  module.exports = City;
  