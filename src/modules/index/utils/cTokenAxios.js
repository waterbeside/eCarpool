import Vue from 'vue'
import router from '../router'
import {ToastPlugin} from 'vux'

import axios from 'axios'
import config from '../config'
import qs from 'qs'


var  lang = localStorage.getItem('language');
lang = lang ?  lang : localStorage.getItem('lang');
lang = lang ?  lang : localStorage.getItem('lag');
var _language = lang;
lang = lang ? lang : 'zh';
var t = {message:[]};
var langPathArray = {
  'zh' : true,
  'vi' : true,
  'en' : true,
}
if(lang && typeof(langPathArray[lang])!="undefined" && langPathArray[lang]){
  t =  require('@/../static/lang/'+lang);
}

const tokenAxios = axios.create({
  // baseURL: process.env.BASE_API,
  timeout: 10000,
  transformRequest: [function (data) {
    // data = Qs.stringify(data);
    return data;
  }],
})
//POST传参序列化(添加请求拦截器)
tokenAxios.interceptors.request.use(config => {

  // config.headers['Content-Type'] = 'application/json;charset=UTF-8';
  // 在发送请求之前做某件事
   if(config.method  === 'post' || config.method  === 'put' ){
     config.data = qs.stringify(config.data);
    /*  // JSON 转换为 FormData
      const formData = new FormData()
      Object.keys(config.data).forEach(function(value,key,arr){
        if(typeof(config.data[value])=="object"){
          Object.keys(config.data[value]).forEach(function(v,k,a){
            formData.append(value+'['+v+']', config.data[value][v])
          })
        }else{
          formData.append(value, config.data[value])
        }

      })
      config.data = formData
      */
   }
   config.headers['X-Requested-With'] = 'XMLHttpRequest'
   // config.withCredentials = false
  // 下面会说在什么时候存储 token
  if(localStorage){
    if(_language){
      config.headers['Accept-Language'] = _language;
    }
    // token放到头
    if (localStorage.getItem('CP_U_TOKEN')) {
      config.headers.Authorization = 'Bearer ' + localStorage.getItem('CP_U_TOKEN');
    }
  }
  return config
},error =>{
    // alert("错误的传参", 'fail')
    return Promise.reject(error)
})

//返回状态判断(添加响应拦截器)
tokenAxios.interceptors.response.use(res =>{
  if(res.status!==200){
    Vue.$vux.toast.text(t.message['networkFail']);
    return Promise.reject(res)
  }
   // console.log(res)
   //对响应数据做些事
    if(res.data.code !==0){
      switch (res.data.code) {
        case 10004:
            // console.log(10004)
            if(router.history.current.name!='login'){
              Vue.$vux.toast.text(t.message['setting.pleaselogin']);
              router.push({ name: 'login'});
            }
          break;
        default:

      }

    }

    return res
}, error => {
    if(error.response.status!==200){
      this.$vux.toast.text(t.message['networkFail']);
    }
    if(error.response.status === 401) {

    } else {
       // do something
    }
    // 返回 response 里的错误信息
    return Promise.reject(error.response.data)
})

// export default tokenAxios;
export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$tokenAxios', { value: tokenAxios })
  }
}
