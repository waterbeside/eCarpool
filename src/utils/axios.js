import axios from 'axios'
import qs from 'qs'


var _language = false;
var lang = "zh";

function getLanguage(){
  let  lang_temp = localStorage ? localStorage.getItem('language') : 'zh';
  lang_temp = lang_temp ?  lang_temp : localStorage.getItem('lang');
  lang_temp = lang_temp ?  lang_temp : localStorage.getItem('lag');
  _language = lang_temp;
  lang = lang_temp ? lang_temp : 'zh';
  return lang;
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
  getLanguage();
  config.isPure = config.isPure || false;
  if(config.isPure) return config;
  var isQs = config.qs === false ? false  : true;
  var unsetAuthorization = config.unsetAuthorization || false;
  var unsetLanguage = config.unsetLanguage || false;

  // config.headers['Content-Type'] = 'application/json;charset=UTF-8';
  // 在发送请求之前做某件事
   if(config.method  === 'post' || config.method  === 'put' || config.method  === 'patch' ||  config.method  === 'delete' ){
     config.data = !isQs   ? config.data : qs.stringify(config.data) ;
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
   // config.headers['X-Requested-With'] = 'XMLHttpRequest'
   // config.withCredentials = false
  // 下面会说在什么时候存储 token
  if(localStorage){
    if(_language  && !unsetLanguage){
      config.headers['Accept-Language'] = _language;
    }
    // token放到头
    if (localStorage.getItem('CP_U_TOKEN') && !unsetAuthorization  ) {
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
    if(res.config.isPure){
      return res;
    }

    //对响应数据做些事
    if(res.data.code !==0){
      switch (res.data.code) {
        case 10004:
            console.log(10004)
          break;
        default:
      }
    }
    return res;
}, error => {
    // 返回 response 里的错误信息
    return Promise.reject(error)
})


export default tokenAxios;
