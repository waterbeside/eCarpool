import axios from '@/modules/index/utils/cTokenAxios'
import config from '@/config'

export default {
  userCarpoolStatis(params){
    return new Promise((resole,reject)=>{
      axios({
        url: config.apiBaseUrl+'/api/v1/publics/reports/user_carpool_statis',
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


