import Vue from 'vue'
import router from '../router'
import {ToastPlugin} from 'vux'

import axios from '@/utils/axios'
import config from '../config'

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
  t =  require('@/assets/lang/'+lang).default;
}

const tokenAxios = axios;

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
    return res;
}, error => {
    if(error.response.status!==200){
      this.$vux.toast.text(t.message['networkFail']);
    }
    if(error.response.status === 401) {

    } else {
       // do something
    }
    // 返回 response 里的错误信息
    return Promise.reject(error)
})

export default tokenAxios;
// export default {
//   install(Vue) {
//     Object.defineProperty(Vue.prototype, '$tokenAxios', { value: tokenAxios })
//   }
// }
