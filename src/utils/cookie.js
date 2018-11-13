
const cookie = {
  //写cookies
  set: function(name, value, time = 0) {
    let days = 30
    let exp = new Date()
    if(time){
      exp.setTime(exp.getTime() + time*1000)
    }else{
      exp.setTime(exp.getTime() + days*24*60*60*1000)
    }
    document.cookie = name + '=' + escape (value) + ';expires=' + exp.toGMTString()
  },
  //读取cookies
  get: function (name) {
    let arr = null
    let reg = new RegExp('(^| )'+name+'=([^;]*)(;|$)')
    if (document.cookie && (arr = document.cookie.match(reg))) {
      return unescape(arr[2])
    } else {
      return null;
    }
  },
  //删除cookies
  delete: function (name) {
    let cval = this.readCookie(name)
    if (cval!=null) {
      document.cookie = name + '=' + cval + ';expires=' + (new Date(0)).toGMTString()
    }
  }
}

export default cookie
