import cookie from './cookie';
import axios from './axios';
import config from '../config'


var  coord = ()=>{
  var cacheKey_currentCoord = "CP_currentCoord";
  var cacheKey_defaultCoord = "CP_defaultCoord";
  var cacheKey_isPushing = "CP_isPushingCoord";
  var cacheKey_unablePush = "CP_unablePushCoord";
  var cacheKey_jwt = "CP_U_TOKEN"
  /**
   * 格式化坐标
   * @param  object|array|string  position 坐标位置
   * @return object               返回坐标
   */
  this.format = (position)=>{
    if(typeof(position)=="string"){
      position = position.split(',');
    }
    if(typeof(position)=="object"){

      if(typeof(position.lat)=="function"  && typeof(position.lng)=="function"){
        position = {
          longitude : position.lng(),
          latitude : position.lat()
        }
      }else if(typeof(position['longitude'])!="undefined"||typeof(position['lng'])!="undefined"){
        position = {
          longitude : position['longitude'] ? position['longitude'] : position['lng'],
          latitude : position['latitude'] ? position['latitude'] : position['lat']
        }
      }else if(position.length > 0 && typeof(position[0])!="undefined" ){
        position = {
          longitude : position[0],
          latitude : position[1]
        }
      }else{
        return false;
      }
      return position;
    }else{
      return false;
    }
  },

  /**
   * 取得默认坐标
   * @return Promise
   */
  this.default =  ()=>{
    var defaultPosition = this.format([112.910868,22.88907]);
    return new Promise ((resolve, reject) => {
      let currentCoord = cookie.get(cacheKey_currentCoord);
      let defaultCoord = localStorage.getItem(cacheKey_defaultCoord);
      var position = false;
      if(currentCoord ){
        position = this.format(JSON.parse(currentCoord));
      }else  if(defaultCoord ){
        position = this.format(JSON.parse(defaultCoord));
      }
      if(position){
        return resolve(position);
      }else{
        this.get('pull').then(res=>{
          if(res.code === 0){
            return resolve(res);
          }else{
            return resolve(defaultPosition);
          }
        }).catch(err=>{
          return resolve(defaultPosition);
        })
      }
    })
  }

  /**
   * 取得用户之前上传到服务器的坐标
   * @param  Number [uid=0] 用户id, 为0时即取当前用户
   * @return Promise (带有code data desc的信息)
   */
  this.pull = (uid = 0)=>{
    return new Promise ((resolve, reject) => {
      axios.get(config.urls.user+"/"+uid+"/position").then(res=>{
        // if(res.data.code ===0){}
        resolve(res.data);
      }).catch(err=>{
        reject(err);
      });
    })
  }



  /**
   * 上传用户坐标
   * @param  object|array [position] 用户坐标, 如果为空时，自动获取
   * @return Promise
   */
  this.push = (position = false)=>{
    return new Promise ((resolve, reject) => {
      if(cookie.get(cacheKey_isPushing) == 1 ||  cookie.get(cacheKey_unablePush) == 1 || !localStorage.getItem(cacheKey_jwt)  ){
        return reject({message:'pushing or not login or too offen'});
      }
      position = this.format(position);
      if(!position){
        this.currentPosition().then(myCoord=>{
          this.push(myCoord).then(res=>{
            return resolve(res);
          }).catch(err=>{
            return reject(err);
          })
        }).catch(err=>{
          return reject(err);
        })
      }else{
        cookie.set(cacheKey_isPushing,1);
        cookie.set(cacheKey_unablePush,1,60*5);
        axios.post(config.urls.user+"/0/position",position).then(res=>{
          cookie.set(cacheKey_isPushing,0);
          if(res.data.code === 0){
            resolve(res.data);
          }else{
            reject(res.data);
          }
        }).catch(err=>{
          cookie.set(cacheKey_isPushing,0);
          reject(err);
        });
      }

    })
  }
  /**
   * 取得浏览器定位坐标
   * @param  0|1 [cache] 是否从缓存取
   * @return Promise
   */
  this.currentPosition = (cache = 0)=>{
    return new Promise ((resolve, reject) => {
      var cacheCurrentCoord = cookie.get(cacheKey_currentCoord);
      if(cache && cacheCurrentCoord){
        let myCoords    = JSON.parse(cacheCurrentCoord);
        return resolve(myCoords);
      }
      if(navigator.geolocation) {
        console.log('Getting position');
        navigator.geolocation.getCurrentPosition( (position)=>{
          console.log('Getting position complete');
          var coords = {
            accuracy:position.coords.accuracy,
            altitude:position.coords.altitude,
            altitudeAccuracy:position.coords.altitudeAccuracy,
            latitude:position.coords.latitude,
            longitude:position.coords.longitude,
            speed:position.coords.speed,
          }
          var coorStr = JSON.stringify(coords);
          cookie.set('CP_currentCoord',coorStr,60*3);
          localStorage.setItem(cacheKey_defaultCoord,JSON.stringify(this.format(coords)));
          return resolve(coords);
        }, (error)=>{
            console.log(error)
            return reject(error);
        },{timeout: 30000, enableHighAccuracy: true, maximumAge: 75000})
      }else{
        return reject({"message":"浏览器不支持获取地理信息"})
      }
    })
  }
  /**
   * 多途径取用户坐标
   * @return Promise (直接返回坐标，不返code)
   */
  this.get = (type="all")=>{
    switch (type) {
      case 'default':
        return  this.default();
        break;
      case 'pull':
        return new Promise ((resolve, reject) => {
          this.pull().then(res=>{
            if(res.code === 0){
              var position = this.format(res.data);
              localStorage.setItem(cacheKey_defaultCoord,JSON.stringify(position));
              return resolve(position);
            }else{
              return reject(res);
            }
          }).catch(err=>{
            return reject(err);
          })
        })
        break;
      case 'current':
        return this.currentPosition();
        break;
      default:
        return new Promise ((resolve, reject) => {
          this.currentPosition(1).then(res=>{
            return resolve(res);
          }).catch(error=>{
            this.default().then(res=>{
              return resolve(res);
            }).catch(err=>{
              return reject(err)
            })
          })
        })
    }

  }

  return this;
}

export default coord;
