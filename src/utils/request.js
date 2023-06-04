import axios from 'axios'
//import qs from 'qs'

axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.defaults.headers.post['Content-Type'] = 'application/json';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 10000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if(!(localStorage.getItem("token")==undefined||localStorage.getItem("token")==null)){
    config.headers.Token = localStorage.getItem("token");
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.status === 200) {
      return response.data
    } else {
      console.log('err:',res.message)
      return Promise.reject('error')
    }
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default service
