// 发送请求
import axios from 'axios'

const Http = {}

Http.install = function (Vue) {

  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    // console.log('拦截器被触发');
    // console.log(config);headers,url
    // 除了登录请求，所有请求统一设置token授权
    if(config.url !== 'login') {
       // 除登录外所有请求都要设置token授权
      const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      config.headers.Authorization = AUTH_TOKEN;
    }
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 4. 添加实例方法
  Vue.prototype.$http = axios
}

export default Http
