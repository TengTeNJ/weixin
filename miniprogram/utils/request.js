import {
    baseUrl
} from '../config/env';
import user from '../utils/user'
/**
 * 通用请求工具
 * @param {Object} options - 请求配置
 * @param {string} options.url - 请求地址
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [options.method='GET'] - 请求方法
 * @param {Object} [options.data] - 请求数据
 * @param {Object} [options.header] - 请求头
 * @param {boolean} [options.showLoading=true] - 是否显示加载提示
 * @param {string} [options.loadingText='加载中...'] - 加载提示文本
 * @returns {Promise<Object>} - 返回的数据对象
 */
export function request(options) {
    const token = user.getToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    const needToken = options['needToken'] || false
    // ✅ 仅当 token 存在时才加 Authorization 字段
    if (token && needToken) {
        headers['X-Badminton-Book-Api-Token'] = `${token}`;
    }
    // 默认配置
    const defaultOptions = {
        method: 'GET',
        header: headers,
        showLoading: true,
        loadingText: '加载中...',
        ...options
    };

    // 显示加载提示
    if (defaultOptions.showLoading) {
        wx.showLoading({
            title: defaultOptions.loadingText,
            mask: true
        });
    }

    // 返回Promise
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + defaultOptions.url,
            method: defaultOptions.method,
            data: defaultOptions.data,
            header: defaultOptions.header,
            success: (res) => {
                // 隐藏加载提示
                if (defaultOptions.showLoading) {
                    wx.hideLoading();
                }

                // 检查返回数据格式
                if (typeof res.data !== 'object' || res.data === null) {
                    wx.showToast({
                        title: '数据格式错误',
                        icon: 'none',
                        duration: 2000
                    });
                    reject(new Error('数据格式错误'));
                    return;
                }

                // 检查业务状态码
                if (res.data.code === '0') {
                    // 请求成功
                    resolve(res.data);
                } else {
                    // 业务错误
                    wx.showToast({
                        title: res.data.msg || '请求失败',
                        icon: 'none',
                        duration: 2000
                    });
                    if ((res.data.code === '401')) {
                        // 清空缓存
                        console.warn('清空缓存')
                        user.clearUserData();
                        // 通知退出登录
                        getApp().eventBus.emit('logout');
                    }
                    reject(new Error(res.data.msg || '请求失败'));
                }
            },
            fail: (err) => {
                // 隐藏加载提示
                if (defaultOptions.showLoading) {
                    wx.hideLoading();
                }

                // 网络错误
                wx.showToast({
                    title: '网络连接失败',
                    icon: 'none',
                    duration: 2000
                });
                reject(err);
            }
        });
    });
}

// 常用请求方法的快捷封装
export const http = {
    /**
     * GET请求
     * @param {string} url - 请求地址
     * @param {Object} [data] - 请求参数
     * @param {Object} [options] - 其他配置
     * @returns {Promise<Object>}
     */
    get(url, data, options = {}) {
        return request({
            url,
            method: 'GET',
            data,
            ...options
        });
    },

    /**
     * POST请求
     * @param {string} url - 请求地址
     * @param {Object} [data] - 请求数据
     * @param {Object} [options] - 其他配置
     * @returns {Promise<Object>}
     */
    post(url, data, options = {}) {
        return request({
            url,
            method: 'POST',
            data,
            ...options
        });
    }
};