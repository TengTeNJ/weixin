/**
 * 环境配置 http://13.49.0.47:91 http://221.229.219.110:8891
 * 切换环境只需修改 currentEnv 的值
 */
const envConfig = {
    // 开发环境
    development: {
      baseUrl: 'http://221.229.219.110:8891'
    },
    // 测试环境
    test: {
      baseUrl: 'https://test-api.example.com'
    },
    // 生产环境
    production: {
      baseUrl: 'https://api.example.com'
    }
  };
  
  // 当前环境（修改这里切换环境）
  const currentEnv = 'development';
  
  // 导出当前环境的配置
  export const baseUrl = envConfig[currentEnv].baseUrl;
  