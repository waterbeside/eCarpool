import Vue from 'vue'
import {ToastPlugin} from 'vux'
import axios from 'axios'
import qs from 'qs'

Vue.use(ToastPlugin);
const tkAxios = axios.create({
  // baseURL: process.env.BASE_API,
  timeout: 10000,
  transformRequest: [function (data) {
    // data = Qs.stringify(data);
    return data;
  }],

})
//POST传参序列化(添加请求拦截器)
tkAxios.interceptors.request.use(config => {
  // config.headers['Content-Type'] = 'application/json;charset=UTF-8';
  // 在发送请求之前做某件事
   if(config.method  === 'post' || config.method  === 'put' ){
     config.data = qs.stringify(config.data);
   }
   config.headers['X-Requested-With'] = 'XMLHttpRequest'
   // config.withCredentials = false
  // token放到头
  if (localStorage.getItem('CP_U_TOKEN')) {
      config.headers.Authorization = 'Bearer ' + localStorage.getItem('CP_U_TOKEN')
  }
  return config
},error =>{
    alert("错误的传参", 'fail')
    return Promise.reject(error)
})

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(res =>{
  if(res.status!==200){
    Vue.$vux.toast.text('网络不畅，请稍候再试');
    return Promise.reject(res)
  }
   // console.log(res)
   //对响应数据做些事
    if(res.data.code !==0){
      switch (res.data.code) {
        case 10004:
            console.log(10004)
          break;
        default:
      }
    }
    return res
}, error => {
    if(error.response.status!==200){
      Vue.$vux.toast.text('网络好像不太畅通');
    }
    if(error.response.status === 401) {

    } else {
       // do something
    }
    // 返回 response 里的错误信息
    return Promise.reject(error.response.data)
})

export default tkAxios;
