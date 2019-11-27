import axios from '@/modules/index/utils/cTokenAxios'
import config from '@/config'

export default {
  getInfo(params){
    return new Promise((resole,reject)=>{
      axios({
        url: config.apiBaseUrl+'/api/v1/passport',
        method: 'get',
        params
      }).then(res=>{
        if(res.data.code === 0){
          resole(res.data);
        }else{
          reject(res);
        }
      }).catch(error=>{
        reject(error);
      })
    })
  }
}


