// 引入axios
import axios from 'axios';
import { Message } from 'element-ui'
import router from '../router/index'

let baseUrl = "http://localhost:8080/";
// 创建axios实例
let httpService = axios.create({
    // url前缀-'http:xxx.xxx'
    // baseURL: process.env.BASE_API, // 需自定义
    baseURL: baseUrl,
    // 请求超时时间
    timeout: 5000 // 需自定义
});

//添加请求和响应拦截器
// 添加请求拦截器
httpService.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //config.headers.token=window.sessionStorage.getItem('token');
    config.headers = { 'Content-Type': 'application/json' }
    // 获取token
    let t = sessionStorage.getItem('token')

    // 如果token存在，就在请求头加token
    if (t) {
        config.headers.token = t
    }

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
httpService.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let code = response.data.code;
    if (code === 401) {
        showMessage('error', "权限不够，禁止访问")
    } else if (code === 401401) {
        showMessage('error', "登录状态已过期，请重新登录")
        router.replace("/login")
    } else {
        return response;
    }
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

function showMessage(status, msg) {
    Message({
        message: msg,
        type: status
    });
}

export default httpService;