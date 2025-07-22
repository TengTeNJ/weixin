const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event, context) => {
  try {
    const res = await cloud.openapi.phonenumber.getPhoneNumber({
      code: event.code
    });
    return {
      phoneNumber: res.phoneInfo.phoneNumber
    };
  } catch (err) {
    return {
      errMsg: err.message
    };
  }
};
