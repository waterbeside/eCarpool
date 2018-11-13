import config from '../config'
import cookie from './cookie';
import axios from './axios';


var scrollTimer = null;
var isGridMapForeign = config.isGridMapForeign;
var cFuns = {
  /**
   * 取得客户端（浏览器）信息
   */
  getClientType (){
    var  browser  =   {
        versions:   function()  {
            var  u  =  window.navigator.userAgent;
            return  {
                trident:  u.indexOf('Trident')  >  -1, //IE内核
                presto:  u.indexOf('Presto')  >  -1, //opera内核
                Alipay:  u.indexOf('Alipay')  >  -1, //支付宝
                webKit:  u.indexOf('AppleWebKit')  >  -1, //苹果、谷歌内核
                gecko:  u.indexOf('Gecko')  >  -1  &&  u.indexOf('KHTML')  ==  -1, //火狐内核
                mobile:  !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios:  !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android:  u.indexOf('Android')  >  -1  , //android终端
                linux:   u.indexOf('Linux')  >  -1, //linux
                iPhone:  u.indexOf('iPhone')  >  -1   , //是否为iPhone
                mac:    u.indexOf('Mac')  >  -1, //是否为mac
                //iPhone: u.match(/iphone|ipod|ipad/),//
                iPad:  u.indexOf('iPad')  >  -1, //是否为iPad
                webApp:  u.indexOf('Safari')  ==  -1, //是否为web应用程序，没有头部与底部
                weixin:  u.indexOf('MicroMessenger')  >  -1, //是否为微信浏览器
                qq: u.match(/\sQQ/i) !== null, //是否QQ
                Safari:  u.indexOf('Safari')  >  -1,
                  ///Safari浏览器,
            };
        }()
    };
    return  browser.versions;
  },

  /**
   * 取得连接参数
   * @param  String name 参数key
   */
  getRequest (name){
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
},

  // 切换页面，并错误提示
  turnPage: (message, url) => {
    if (message) {
      alert(message)
    }
    if (url) {
      if (pageMap[url]) {
        url = pageMap[url]
      }
      window.location.href = url
    }
  },

  /**
   * 页面跳转
   * @param  string url URL
   * @param  object win 窗口对像
   */
  redirect (url,win){
    var lct = typeof(win)!="undefined" ? win.location : location;
    //console.log(lct);
    lct.href = url;
  },

  getLanguage (dontFromCache){
    dontFromCache = dontFromCache || 0;
    let lang = "";
    if(localStorage && !dontFromCache){
      lang = localStorage.getItem('language');
      lang = lang ?  lang : localStorage.getItem('lang');
      lang = lang ?  lang : localStorage.getItem('lag');
    }
    if(lang){
      return lang;
    }
    var _language = "en";
    if (navigator.language) {
      _language = navigator.language;
    }else {
      _language = navigator.browserLanguage;
    }
    return _language;
  },

  formartLanguage(_language){
    var arrowLang = "zh,zh-tw,zh-hk,vi,en,"
    var lang = _language;
    var language_lower = _language.toLowerCase();
    if(arrowLang.indexOf(language_lower) == -1){
      lang = "en";
    }
    if(language_lower.indexOf('-')>0){
      var langTempArr = language_lower.split('-');
      lang = langTempArr[0];
    }
    return lang;
  },

  /**
   * 验证反回码是否未登入
   * @param  int code      [返回码]
   * @param  object vueObj    [VUE对像]
   * @param  boolean showToast [是否显示吐司]
   */
  checkLoginByCode (code,vueObj,showToast){
  	showToast = showToast || 1
  	if(code===10004){

  		if(showToast && vueObj){
  			vueObj.$vux.toast.text('请先登入');
  		}
      if(vueObj){
        vueObj.$router.push({ name: 'login'});
      }else{
        this.redirect("/#/login");
      }
  		return false;
  	}
  	return true;
  },


 formatDate(date,fmt){
  	var o = {
  			 "m+": date.getMonth() + 1, //月份
  			 "d+": date.getDate(), //日
  			 "h+": date.getHours(), //小时
  			 "i+": date.getMinutes(), //分
  			 "s+": date.getSeconds(), //秒
  			 "q+": Math.floor((date.getMonth() + 3) / 3), //季度
  			 "S": date.getMilliseconds() //毫秒
  	 };
  	 if (/(y+)/.test(fmt)) {
  			 fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  	 }
  	 for (var k in o)
  			 if (new RegExp("(" + k + ")").test(fmt))
  					 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  	 return fmt;

  },

  //个位数补充0
   fixZero (num){
    num = num >= 0 && num <= 9 ?   "0" + num : num;
    return num;
  },

  //格式化日期数据
   formatDayItemData (date,text){
    text = text || '';
    var month = date.getMonth() + 1;
    month = this.fixZero(month);
    var day = date.getDate();
    day = this.fixZero(day);
    text = text.trim()=='' ? date.getFullYear() + '-' + month + '-' + day : text;
    return {"value":(date.getFullYear()+'-'+month+'-'+day),"name":text}
  },

  /**
   * 取得日期时间列表数据
   * @param  boolean type      1 日期 2 时 3 分
   * @param  boolean onlyNow   取现时
   */
  returnNeedTimeDatas (type,onlyNow,texts){
    type = type || 0;
    texts = texts || ['今天','明天','后天'];
    onlyNow = onlyNow || 0;
    var nowDate = new Date();
    // console.log(nowDate.getTimezoneOffset());
    // console.log(nowDate.getUTCHours());
    var month = nowDate.getMonth() + 1;
    var howManyDay = 7;
    var data_dates = [];
    var data_hours = [];
    var data_min = [];
    //取得n天后的Date对像。
    function getNextDate(n){
      var nextDate = new Date();
      nextDate.setDate(nowDate.getDate()+n);
      return nextDate;
    }

    //取日期数据数组
    if(type==1 || type == 0 ){
      for(let i=0; i<howManyDay;i++){
        var date = getNextDate(i);
        var text = '';
        if(i==0){text=texts[0];}
        if(i==1){text=texts[1];}
        // if(i==2){text=texts[2];}
        data_dates[i] = this.formatDayItemData(date,text);
      }
      if(type>0){return data_dates;}
    }
    //时数组
    if(type==2 || type == 0 ){
      var hour_start = onlyNow ? nowDate.getHours() : 0 ;

      for(let i=hour_start;i<24;i++){
        data_hours[i-hour_start] = {"value":this.fixZero(i),"name":(i)+'时'}
      }
      if(type>0){return data_hours;}
    }
    //分数组
    if(type==3 || type == 0 ){
      var min_start = onlyNow ? nowDate.getMinutes() : 0 ;
      for(let i=min_start;i<60;i++){
        data_min[i-min_start] = {"value":this.fixZero(i),"name":(i)+'分'}
      }
      if(type>0){return data_min;}
    }
    return [data_dates,data_hours,data_min]
  },


  getScript (setting){
    return new Promise ((resolve, reject) => {
      var settingDefault = {
        async:false,
        defer:false,
      }
      var opt = Object.assign({},settingDefault,setting);
      const script = document.createElement('SCRIPT')

      script.setAttribute('src', opt.url)
      if(opt.async){
        script.setAttribute('async', '')
      }
      if(opt.defer){
        script.setAttribute('defer', '')
      }
      if (script.addEventListener) {
        script.addEventListener('load',  ()=>{
            resolve();
        }, false);
      } else if (script.attachEvent) {
          script.attachEvent('onreadystatechange',  ()=>{
              var target = window.event.srcElement;
              if (target.readyState == 'loaded') {
                  resolve();
              }
          });
      }
      document.body.appendChild(script);
    })
  },


  getCoords (refresh = 0){
    return new Promise ((resolve, reject) => {
      if(!refresh && cookie.get('CP_currentCoords')){
        let myCoordsStr = cookie.get('CP_currentCoords');
        let myCoords    = JSON.parse(myCoordsStr);
        resolve(myCoords);
      }
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( (position)=>{
          var coords = {
            accuracy:position.coords.accuracy,
            altitude:position.coords.altitude,
            altitudeAccuracy:position.coords.altitudeAccuracy,
            latitude:position.coords.latitude,
            longitude:position.coords.longitude,
            speed:position.coords.speed,
          }
          var coorStr = JSON.stringify(coords);
          cookie.set('CP_currentCoords',coorStr,60*5);
          resolve(coords);
        }, (error)=>{
            //处理错误
          /*  switch (error.code) {
                case 1:
                    error.message = "位置服务被拒绝";
                    break;
                case 2:
                    error.message = "暂时获取不到位置信息。";
                    break;
                case 3:
                    error.message = "获取信息超时。";
                    break;
                default:
                    error.message = "未知错误";
                    break;
            }*/
            console.log(error)
            reject(error);
        })
      }else{
        reject({"message":"浏览器不支持获取地理信息"})
      }
    })
  },
  //谷歌地圖方法。
  gmap :{

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
        this.load(loadsetting).then(()=>{
          var settingDefault = {
            center: new google.maps.LatLng(22.88907, 112.910868),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            autoCenter:true,
            fullscreenControl:false,
            scaleControl: false,
            streetViewControl: false,
            mapTypeControl:false,
            overviewMapControl:false,
            panControl: false,
            // zoomControl: false,
            // disableDefaultUI:true,
          }
          if( cookie.get('CP_currentCoords')){
            var myCoordsStr = cookie.get('CP_currentCoords');
            var myCoords    = JSON.parse(myCoordsStr);
          }
          if(typeof(myCoords)=="object"){
            settingDefault.center = new google.maps.LatLng(myCoords.latitude,myCoords.longitude);
          }
          this.getCity().then(res=>{

          });

          var opt = Object.assign({},settingDefault,setting);
          var map = new google.maps.Map(document.getElementById(target),opt);
          if(typeof(myCoords)!="object"){
            cFuns.getCoords(1).then(res=>{
              if(opt.autoCenter){
                map.setCenter(new google.maps.LatLng(res.latitude,res.longitude));
              }
            });
          }
          resolve(map);
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
        cFuns.getCoords().then(coords=>{
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
              var citys = [];
              results[0].address_components.forEach((value,index,arr)=>{
                citys.push(value.short_name);
              })
              var cityArray = {
                "formatted_address":results[0].formatted_address,
                "country": citys[(citys.length - 1 > 0 ? citys.length - 1 : 0)].short_name,
                "province": citys[(citys.length - 2 > 0 ? citys.length - 2 : 0)].short_name,
                "city": citys[(citys.length - 3 > 0 ? citys.length - 3 : 0)].short_name,
                "district": citys[(citys.length - 4 > 0 ? citys.length - 4 : 0)].short_name,
                "street": results[1].address_components[0].short_name,
                "lists":citys,
              }
              var cityStr = JSON.stringify(cityArray);
              cookie.set(keyOfCache,cityStr,60*5);
              resolve(results);
            }
            reject(res);
          }).catch(e=>{
            reject(e);

          })
        })

      })
    },

    /**
     * 加marker
     */
    addMarker (position,mapObj,title="marker") {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.lat, position.lng),
        title: title
      });
      marker.setMap(mapObj);
      return marker;
    },
    /**
     * 删marker
     */
    removeMarker (marker,mapObj){
      marker.setMap(null);
    },

    //至中心点
    setCenter (position,mapObj,zoom = false) {
      // mapObj.setCenter(new google.maps.LatLng(position.lat,position.lng));
      mapObj.panTo(new google.maps.LatLng(position.lat,position.lng));
      if(zoom){
        mapObj.setZoom(zoom);
      }

    },

    //画线
    drawTripLine(start,end,mapObj,setting){
      return new Promise ((resolve, reject) => {
        var defaultSetting={
          origin:new google.maps.LatLng(start.lat,start.lng),
          destination: new google.maps.LatLng(end.lat,end.lng),
          travelMode:'DRIVING',
          // key:config.gMapKey
       };
       var params = Object.assign({},defaultSetting,setting);
       var directionsService = new google.maps.DirectionsService();
       var directionsDisplay = new google.maps.DirectionsRenderer();
       directionsDisplay.setMap(mapObj);
       directionsService.route(params, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            resolve(result);
          }else{
            reject(result);
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

          cFuns.getCoords().then(res=>{
            var request = {
             radius: 10000,
             query: keyword,
             location:new google.maps.LatLng(res.latitude,res.longitude),
            };
            if(!keyword){
              service.nearbySearch(request, (results, status)=>{
                console.log(results)
                resolve({status:status,results:results})
              });
            }else{
              service.textSearch(request, (results, status)=>{
                console.log(results)
                resolve({status:status,results:results})
              });
            }
          })

        /*var request = {
         query: keyword,
         fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
        };
        service.findPlaceFromQuery(request, (results, status)=>{
          console.log(results)
          resolve({status:status,result:results})
        });*/

      })
    },


    formatPlusCodeCity (plusStr){
      var plusArray = plusStr.split(' ');
      var a1 = typeof(plusArray[1]) !="undefined" ?  plusArray[1] : "";
      var a2 = typeof(plusArray[2]) !="undefined" ?  plusArray[2] : "";
      return a1+","+a2
    },




  },





  //地图类方法
  amap:{

    showMap (target,setting,callback){
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
            callback(res);
          }
        })
      }else{
        if(typeof(callback)=="function"){
          callback({});
        }
      }
      return map;
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
    /**
     * 加marker
     */
    addMarker (position,mapObj) {
      mapObj.setZoomAndCenter(14, position);
      var marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        // position: [116.405467, 39.907761]
        position: position,
      });
      marker.setMap(mapObj);
      return marker;
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
          console.log(result)
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
}

export default cFuns;
