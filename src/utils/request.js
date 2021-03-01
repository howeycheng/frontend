import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: process.env.VUE_APP_BASE_API,
    // 超时
    timeout: 10000
    // withCredentials:true
})


// request拦截器
// service.interceptors.request.use(config => {
//     return config
// }, error => {
//     // eslint-disable-next-line no-console
//     console.log(error)
//     Promise.reject(error)
// })



export default service