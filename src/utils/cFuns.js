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



}

export default cFuns;
