import config from '../config'
import axios from './axios';
import cFuns from './cFuns';


var isGridMapForeign = config.isGridMapForeign;
//高德地圖方法。
var cAmap = {

    showMap (target,setting,callback){
      return new Promise ((resolve, reject) => {
        var settingDefault = {
          gridMapForeign:isGridMapForeign,
          enableHighAccuracy:true,
          zoomToAccuracy:true,
        }
        var opt = Object.assign({},settingDefault,setting);
        var map = new AMap.Map(target, opt);
        if(opt.enableHighAccuracy){
          this.getLocalPosition({zoomToAccuracy:opt.zoomToAccuracy },map).then(res=>{
            var resStr = JSON.stringify(res);
            localStorage.setItem('carpool_local_info',resStr);
            if(typeof(callback)=="function"){
              callback(res,map);
            }
          })
        }else{
          if(typeof(callback)=="function"){
            callback({},map);
          }
        }
        resolve(map);
      })
    },

    /**
     * 定位，并移到中心
     */
    getLocalPosition(setting,mapObj) {
      var settingDefault = {
        }
      var opt = Object.assign({},settingDefault,setting);
      return new Promise ((resolve, reject) => {
        this.getGeolocation(opt).then(geolocation=>{
           mapObj.addControl(geolocation);
           geolocation.getCurrentPosition(function(status,result){
             if(status=='complete'){
               resolve(result)
            }else{
              reject(result)
            }
           });
        });
      })
    },
    /**
     * 清地图
     */
    clear (mapObj){
        mapObj.clearMap();
    },

    //格式化坐标
    formatCoords(position,type=0){
      var pos = [];
      if(typeof(position.longitude)!='undefined'){
        pos = [parseFloat(position.longitude),parseFloat(position.latitude)];
      }else if(typeof(position.lng)!='undefined'){
        pos = [parseFloat(position.lng),parseFloat(position.lat)];
      }else if( typeof(position[0]) == "number" && typeof(position[1]) == "number"){
        pos = position
      }else{
        return false;
      }
      if(type){
        position = new AMap.LngLat(pos[0], pos[1]);
      }else{
        position = pos
      }
      return position
    },
    /**
     * 加marker
     */
    addMarker (position,mapObj,setting) {

      var settingDefault = {
        autoCenter: false,
        color:'blue',
      }
      if(typeof(position.position)=="object"){
        position.position = this.formatCoords(position.position);
        setting = position;
        if(typeof(position.map)=="object"){
          mapObj = position.map;
        }
      }else{
        position = this.formatCoords(position);
        settingDefault.position = position;
      }

      var opt = Object.assign({},settingDefault,setting)
      if(!opt.icon){
        switch (opt.color) {
          case 'blue':
            opt.icon=  "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png";
            break;
          case 'red':
            opt.icon=  "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png";
            break;
          default:
            opt.icon=  "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png";
        }
      }
      if(opt.autoCenter){
        mapObj.setZoomAndCenter(14, opt.position);
      }
      var marker = new AMap.Marker(opt);
      marker.setMap(mapObj);
      return marker;
    },

    setMarkerColor (marker,color){
      var src = "";
      switch (color) {
        case 'blue':
          src =  "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png";
          break;
        case 'red':
          src=  "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png";
          break;
        default:
          src=  "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png";
      }
      var markerContent = document.createElement("div");
      var markerImg = document.createElement("img");
      markerImg.className = "markerlnglat";
      markerImg.src = src;
      markerContent.appendChild(markerImg);
      marker.setContent(markerContent); //更新点标记内容
    },

    /**
     * 删marker
     */
    removeMarker (marker,mapObj){
      mapObj.remove(marker);
    },
    //至中心点
    setCenter (position,mapObj,zoom) {
      zoom = zoom || 14
      // console.log(position);
      mapObj.setZoomAndCenter(zoom, position);
    },
    //画线
    drawTripLine(start,end,mapObj,callBack){
      // mapObj.clearMap();
      AMap.service('AMap.Driving',function(){//回调函数

      //实例化Driving
        let map_draw = new AMap.Driving({
              map: mapObj,
              // panel: "panel"
        });
        map_draw.search(start, end, function(status, result) {
           //TODO 解析返回结果，自己生成操作界面和地图展示界面
           if(typeof(callBack)=='function'){
  					 callBack(status,result);
  				 }
        });
      })
    },
    /**
     * 取得地理编码组件
     */
    getGeocoder(setting) {
      var options = {};
      if(typeof(setting)=="string"){
        options = {city:setting};
      }
      var settingDefault = {}
      var opt = Object.assign({},settingDefault,options);
      return new Promise ((resolve, reject) => {
        AMap.plugin('AMap.Geocoder',()=>{
            var geocoder = new AMap.Geocoder(opt);
            resolve(geocoder)
        });
      })
    },
    /**
     * 取得本地定位组件
     */
    getGeolocation(setting) {
      var settingDefault = {
        enableHighAccuracy: true,
        zoomToAccuracy: true,
        timeout: 10000,
      }
      var opt = Object.assign({},settingDefault,setting);
      return new Promise ((resolve, reject) => {
        AMap.plugin('AMap.Geolocation',()=>{
            var geolocation = new AMap.Geolocation(opt);
            resolve(geolocation)
        });
      })
    },
    /**
     * 取得坐标的地址信息
     * @param  {array} lnglat  [坐标]
     * @param  {function} callback [回调函数]
     */
    getMarkerInfo (lnglat,geocoder){
      return new Promise ((resolve, reject) => {
        geocoder.getAddress(lnglat,(status,result)=>{
          resolve({status:status,result:result})
        })
      });
    },
    /**
     * 取得当前城市
     */
    getCity (mapObj){
      return new Promise ((resolve, reject) => {
        mapObj.getCity((data)=> {
          // alert(JSON.stringify(data));
          resolve(data);
        });
      })
    },
    /**
     * getPlaceSearch
     */
    getPlaceSearch(options){
      var settingDefault = {
           pageSize: 15,
           pageIndex: 1,
       }
      var opt = Object.assign({},settingDefault,options);
      return new Promise ((resolve, reject) => {
        AMap.service('AMap.PlaceSearch',()=>{
         var placeSearch = new AMap.PlaceSearch(opt);
         resolve(placeSearch);
       })
      })
    },
    /**
     * 地址搜索
     */
    placeSearch(keyword,options){
      return new Promise ((resolve, reject) => {
        this.getPlaceSearch(options).then(placeSearch=>{
          placeSearch.search(keyword, (status, result)=>{
            resolve({status:status,result:result})
          })
        })

      })
    },
    /**
     * getAutocomplete
     */
    getAutocomplete(options){
      var settingDefault = { }
      var opt = Object.assign({},settingDefault,options);
      return new Promise ((resolve, reject) => {
        AMap.service('AMap.Autocomplete',()=>{
         var Autocomplete = new AMap.Autocomplete(opt);
         resolve(Autocomplete)
       })
      })
    },
    /**
     * 地址搜索
     */
    autoComplete(keyword,options){
      return new Promise ((resolve, reject) => {
        this.getAutocomplete(options).then(autoComplete=>{
          autoComplete.search(keyword, (status, result)=>{
            resolve({status:status,result:result})
          })
        })

      })
    },
    /**
     * 添加窗体覆盖物
     */
    showInfoWindow(options,mapObj){
      var settingDefault = {
        position:[],
        content:"",
        offset: new AMap.Pixel(0, -20),
      }
      var opt = Object.assign({},settingDefault,options);
      // 创建 infoWindow 实例
      var infoWindow = new AMap.InfoWindow(opt);
      // 打开信息窗体
      infoWindow.open(mapObj);
      return infoWindow;
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

    // 格式化行程用时
   formatTripTime (dtTime,texts){
     texts = texts || ['小时','分钟'];
    	var dtTimeStr = '';
    	if(dtTime > 3600){
        dtTimeStr = (dtTime/3600).toFixed(2)+texts[0];
    		// dtTimeStr = Math.floor(dtTime/3600)+texts[0] + Math.floor((dtTime%3600)/60)+texts[1];
    	}else if(dtTime > 60){
    		dtTimeStr =  Math.floor((dtTime)/60)+texts[1];
    	}
    	return dtTimeStr;
    }
}


export default cAmap;
