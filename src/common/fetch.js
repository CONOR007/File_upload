/*
 * @Author: guansheng.guo
 * @Date: 2022-04-18 22:48:46
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-23 12:01:33
 * @Description:
 */
import axios from "axios";
import qs from "qs";
const serverUrl = "http://127.0.0.1:8888/"; 

//使用create方法创建axios实例
 const request = axios.create({
  timeout: 7000, // 请求超时时间
  baseURL: serverUrl,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
// 添加请求拦截器
request.interceptors.request.use((config) => {
    if (config.headers["Content-Type"] === 'application/x-www-form-urlencoded') {
      config.data = qs.stringify(config.data)
    }
  return config;
});


// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (reason) => {
    // 请求失败统一处理
    return Promise.reject(reason);
  }
);
export default request;