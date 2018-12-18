import config from '../config'
import cookie from './cookie';
import axios from './axios';
import cFuns from './cFuns';
import cCoord from './cCoord';

//谷歌地圖方法。
var cGmap = {

  //加載地圖
  load ({ apiKey=config.gMapKey, version='', libraries=["places"], loadCn=false }={}){
    return new Promise ((resolve, reject) => {

      if (typeof window === 'undefined') {
        // Do nothing if run from server-side
        reject({"message":"Do nothing if run from server-side"});
      }
      if ( !window.google || !window.google.maps) {

        // Allow apiKey to be an object.
        // This is to support more esoteric means of loading Google Maps,
        // such as Google for business
        // https://developers.google.com/maps/documentation/javascript/get-api-key#premium-auth
        var options = {}
        if (typeof apiKey === 'string') {
          options.key = apiKey
        } else if (typeof apiKey === 'object') {
          for (let k in apiKey) { // transfer values in apiKey to options
            options[k] = apiKey[k]
          }
        } else {
          options.key = config.gMapKey;
          // reject({"message":"`apiKey` should either be a string or an object"});
        }

        // libraries
        let librariesPath = ''
        if (libraries && libraries.length > 0) {
          librariesPath = libraries.join(',')
          options['libraries'] = librariesPath
        } else if (Array.prototype.isPrototypeOf(options.libraries)) {
          options.libraries = options.libraries.join(',')
        }
        // options['callback'] = 'GMapsLoaded'

        let baseUrl = 'https://maps.googleapis.com/'

        if (typeof loadCn === 'boolean' && loadCn === true) {
          baseUrl = 'http://maps.google.cn/'
        }

        let url = baseUrl + 'maps/api/js?' +
        Object.keys(options)
          .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(options[key]))
          .join('&')

        if (version) {
          url = url + '&v=' + version
        }

        cFuns.getScript({url:url,async:true,defer:true}).then(()=>{
          resolve();
        });
      }else{
        resolve();
      }
    });
  },

  //显示地图
  showMap (target,setting,loadsetting={}){
    return new Promise ((resolve, reject) => {
      var Coord = new cCoord();
      this.load(loadsetting).then(()=>{
        var settingDefault = {
          center: new google.maps.LatLng(10.782053,106.683886),
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          autoCenter:true,
          fullscreenControl:false,
          scaleControl: false,
          streetViewControl: false,
          mapTypeControl:false,
          overviewMapControl:false,
          noClear:false,
          panControl: false,
          // zoomControl: false,
          // disableDefaultUI:true,
        }
        Coord.default().then(defaultCoord=>{

          settingDefault.center = new google.maps.LatLng(defaultCoord.latitude,defaultCoord.longitude);
          var opt = Object.assign({},settingDefault,setting);
          var map = new google.maps.Map(document.getElementById(target),opt);
          Coord.currentPosition(1).then(res=>{
            if(opt.autoCenter){
                map.setCenter(new google.maps.LatLng(res.latitude,res.longitude));
            }
            this.getCity().then(res=>{});
          })
          resolve(map);
        })

      }).catch((e)=>{
        reject(e);
      })
    })
  },

  /**
   * 取得当前城市
   */
  getCity (refresh = 0){
    return new Promise ((resolve, reject) => {
      var keyOfCache = "CP_currentCity_"+cFuns.getLanguage();
      if(!refresh && cookie.get(keyOfCache)){
        let myCityStr = cookie.get(keyOfCache);
        let myCity    = JSON.parse(myCityStr);
        return resolve(myCity);
      }
      cCoord().currentPosition(1).then(coords=>{
        this.getCityByGoord(coords).then(res=>{
          resolve(res);
        }).catch(error=>{
          reject(error)
        });
      }).catch(error=>{
        reject(error)
        // this.getCityByGoord(coords);
      })
    })
  },

  getCityByGoord (coords){
    return new Promise ((resolve, reject) => {
      var keyOfCache = "CP_currentCity_"+cFuns.getLanguage();
      var params={
        latlng:coords.latitude+","+coords.longitude,
        key:config.gMapKey
      };
      axios.get('https://maps.google.cn/maps/api/geocode/json',{"params":params,'isPure':true}).then(res=>{
        if(res.status !== 200){
          reject(res);
        }
        if(typeof(res.data.results)=="object"){
          let results = res.data.results;
          var cityObj = this.formatCitys(results[1]);
          // cityObj.street = results[1].address_components[0].short_name,
          var cityStr = JSON.stringify(cityObj);
          cookie.set(keyOfCache,cityStr,60*2);
          resolve(results);
        }else{
          reject(res);
        }
      })
    })
  },

  //格式化坐标
  formatCoords(position){
    // console.log(position);
    position = typeof(position.lat) == "function" ? position : new google.maps.LatLng(position.lat, position.lng);
    return position
  },

  //
  formatCitys(data){
    var citys = [];
    data.address_components.forEach((value,index,arr)=>{
      citys.push(value.short_name);
    })
    var cityObj = {
      "formatted_address":data.formatted_address,
      "country": citys[(citys.length - 1 > 0 ? citys.length - 1 : 0)].short_name,
      "province": citys[(citys.length - 2 > 0 ? citys.length - 2 : 0)].short_name,
      "city": citys[(citys.length - 3 > 0 ? citys.length - 3 : 0)].short_name,
      "district": citys[(citys.length - 4 > 0 ? citys.length - 4 : 0)].short_name,
      "street": citys[(citys.length - 5 > 0 ? citys.length - 4 : 0)].long_name,
      "lists":citys,
    }
    return cityObj;
  },

  /**
   * 加marker
   */
  addMarker (position,mapObj,setting) {
    position = this.formatCoords(position);
    var settingDefault = {
      position: position,
      animation:google.maps.Animation.DROP
    }
    var opt = Object.assign({},settingDefault,setting)
    var marker = new google.maps.Marker(opt);
    marker.setMap(mapObj);
    return marker;
  },
  /**
   * 删marker
   */
  removeMarker (marker){
    if(marker){
      return marker.setMap(null);
    }
  },

  //至中心点
  setCenter (position,mapObj,zoom = false) {
    // mapObj.setCenter(new google.maps.LatLng(position.lat,position.lng));
    position = this.formatCoords(position);
    mapObj.panTo(position);
    if(zoom){
      mapObj.setZoom(zoom);
    }

  },

  //画线
  drawTripLine(start,end,mapObj,setting={}){
    // console.log(google)
    start = this.formatCoords(start);
    end = this.formatCoords(end);
    return new Promise ((resolve, reject) => {
      var defaultSetting={
        origin:start,
        destination: end,
        travelMode:'DRIVING',
        // key:config.gMapKey
     };
     var directionsService = new google.maps.DirectionsService();
     var directionsDisplay =  new google.maps.DirectionsRenderer();
     /*if(typeof(setting.directionsDisplay)=="object" ){
        directionsDisplay =  setting.directionsDisplay ;
        setting.directionsDisplay = null
     }*/
     var params = Object.assign({},defaultSetting,setting);

     directionsDisplay.setMap(mapObj);
     directionsService.route(params, function(results, status) {
       var res = {
         results,status,directionsDisplay
       }
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(results);
          resolve(res);
        }else{
          reject(res);
        }
      });
    });
  },

  // 格式化行程距离
  formatDistance (distance,returnType){
    returnType = returnType || 0
    var distanceStr = distance + 'M';
    var unit = 'M';
    var dtTimeStr = '';
    if(distance > 1000){
      distance = (distance/1000).toFixed(1);
      unit = 'KM'
      distanceStr = distance + 'KM';
    }
    if(returnType){
      return {unit:unit,distance:distance};
    }else{
      return distanceStr;
    }

  },


  /**
   * 地址搜索
   */
  placeSearch(keyword,mapObj,options){
    return new Promise ((resolve, reject) => {
      var service = new google.maps.places.PlacesService(mapObj);
        var settingDefault = {
          radius: 20000,
          query: keyword,
        }
        var opt = Object.assign({},settingDefault,options);
        if(opt.location){
          if(!keyword){
            service.nearbySearch(opt, (results, status)=>{
              resolve({status:status,results:results})
            });
          }else{
            service.textSearch(opt, (results, status)=>{
              resolve({status:status,results:results})
            });
          }
        }else{
          cCoord().default().then(res=>{
            opt.location = new google.maps.LatLng(res.latitude,res.longitude);
            this.placeSearch(keyword,mapObj,opt).then(res=>{
              resolve(res);
            }).catch(error=>{
              console.log(error)
              reject(error);
            });
          })
        }

    })
  },

  //逆地理编码
  reGeocoder(position,mapObj){
    return new Promise ((resolve, reject) => {
      position = this.formatCoords(position);
      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({'location': position}, function(results, status) {
        var res = {results,status}
        if (status === 'OK') {
          resolve(results);
        /*  if (results[0]) {
            // mapObj.setZoom(11);
            var marker = new google.maps.Marker({
              position: position,
              map: mapObj
            });
            infowindow.setContent(results[0].formatted_address);
            infowindow.open(mapObj, marker);
          } else {
            window.alert('No results found');
          }*/
        } else {
          reject(res)
        }
      });
    })

  },

  /**
   * 添加窗体覆盖物
   */
  showInfoWindow(options,mapObj=NULL,marker=NULL){
    var settingDefault = {
      content:"",
    }
    var opt = Object.assign({},settingDefault,options);
    // 创建 infoWindow 实例
    var infowindow = new google.maps.InfoWindow(opt);
    // 打开信息窗体
    if(mapObj){
      infowindow.open(mapObj,marker);
    }
    return infowindow;
  },


  //格式化PlusCode以取得城市。
  formatPlusCodeCity (plusStr){
    var plusArray = plusStr.split(' ');
    var a1 = typeof(plusArray[1]) !="undefined" ?  plusArray[1] : "";
    var a2 = typeof(plusArray[2]) !="undefined" ?  plusArray[2] : "";
    return a1+(a2 ? (","+a2) : "");
  },


}


export default cGmap;
