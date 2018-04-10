import config from '../configs'
import axios from 'axios';


var scrollTimer = null

var cFuns = {


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
  returnNeedTimeDatas (type,onlyNow){
    type = type || 0;
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
        if(i==0){text='今天';}
        if(i==1){text='明天';}
        if(i==2){text='后天';}
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


  //地图类方法
  amap:{
    showMap (target){
      var map = new AMap.Map(target, {
      // resizeEnable: true,
      //zoom:11,
      // center: [112.903921, 22.884658]
      });

      return map;
    },
    addMarker (position,mapObj) {
      // console.log(position);
      mapObj.setZoomAndCenter(14, position);
      marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        // position: [116.405467, 39.907761]
        position: position,
      });
      marker.setMap(mapObj);
    },
    //至中心点
    setCenter (position,mapObj,zoom) {
      zoom = zoom || 14
      // console.log(position);
      mapObj.setZoomAndCenter(zoom, position);
    },
    //画线
    drawTripLine(start,end,mapObj,callBack){
      console.log(mapObj)
      // mapObj.clearMap();
      AMap.service('AMap.Driving',function(){//回调函数
      //实例化Driving
        let map_draw = new AMap.Driving({
              map: mapObj,
              // panel: "panel"
        });

        //TODO: 使用driving对象调用驾车路径规划相关的功能
        //传经纬度
        //  driving.search(new AMap.LngLat(116.379028, 39.865042), new AMap.LngLat(116.427281, 39.903719));
        map_draw.search(start, end, function(status, result) {
           //TODO 解析返回结果，自己生成操作界面和地图展示界面
           if(typeof(callBack)=='function'){
  					 callBack(status,result);
  				 }
          console.log(result)
        });
      })
    },

    // 格式化行程距离
    formatDistance (distance,returnType){
    	returnType = returnType || 0
    	var distanceStr = distance + '米';
    	var unit = 'M';
    	var dtTimeStr = '';
    	if(distance > 1000){
    		distance = (distance/1000).toFixed(1);
    		unit = 'KM'
    		distanceStr = distance + '公里';
    	}
    	if(returnType){
    		return {unit:unit,distance:distance};
    	}else{
    		return distanceStr;
    	}

    },

    // 格式化行程用时
   formatTripTime (dtTime){
    	var dtTimeStr = '';
    	if(dtTime > 3600){
    		dtTimeStr = Math.floor(dtTime/3600)+'小时' + Math.floor((dtTime%3600)/60)+'分钟';
    	}else if(dtTime > 60){
    		dtTimeStr =  Math.floor((dtTime)/60)+'分钟';
    	}
    	return dtTimeStr;
    }
  }
}

export default cFuns;
