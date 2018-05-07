<template>
  <div class="cp-all">
    <div id="app">
      <!-- 如果是在微信里打开则显示 -->
      <div class="wx-tips-wrap" v-show="isShowWxTips" style="">
  		    <img class="arrow-pic" src="../../assets/images/arrow-topright-s.png" >
  		    <h3>如果您无法启动或下载APP，请在右上角的按钮，选择【在浏览器中打开】”。</h3>
      </div>
      <cp-view-box>
        <div class="container ">
          <div class="cp-main" ref="mainbox">

            <div class="cp-tripDetail-wrapper" v-if="(r=='info'||r=='lovewall')&& detailData">
              <div class="cp-heading-wrapper"  v-if="user"  >
                <div class="cp-heading " >
                    <cp-avatar :src="user.avatar"></cp-avatar>
                    <div class="cp-txt">
                      <h3>{{user.name}}</h3>
                    </div>
                    <h6>{{typeLabel}}</h6>
                    <h4 class="department">{{user.Department}}</h4>
                </div>
                <div class="cp-heading-bg" ></div>
              </div>
              <cp-trip-box v-if="detailData" :start_name="detailData.start_info.addressname" :end_name="detailData.end_info.addressname"></cp-trip-box>
              <div class="cp-cell cp-cell-time">
                  <div class="la"><i class="fa fa-clock-o"></i></div>
                  <span class="cp-time">{{detailData.time_format}}</span>
                  <small class="cp-label">出发时间</small>
              </div>
              <div class="cp-cell ">
                  <div class="la"><i class="fa fa-info"></i></div>
                  <span v-html="statusText"></span>
              </div>
            </div>

            <div class="alert alert-warning" style="box-shadow: 0 0 10px rgba(0,0,0,.1);">
              您已打开分享页面，App将会自动启动，<br />如果没有安装【溢起拼车】，可点击底部的下载按钮安装使用，你亦可使用H5使进行体验。
            </div>

          </div>
          <!-- 如果启动app失败则显示 -->
          <div class="cp-share-footer"  id="footer">
              <div class="router-link cp-bar-tab-item "  >
                <a href="http://m.esquel.cn/apps/gek/Carpool/downloadandroid.php">
                  <i class="cp-iconfont fa fa-android"></i>
                  <div class="cp-bar-tab-label">安卓手机下载</div>
                </a>
              </div>
              <div   class="router-link cp-bar-tab-item">
                <a href="http://m.esquel.cn/apps/gek/Carpool/downloadios.php">
                  <i class="cp-iconfont fa fa-apple"></i>
                  <div class="cp-bar-tab-label">苹果手机下载</div>
                </a>
              </div>
              <div   class="router-link cp-bar-tab-item" >
                <a :href="h5Url">
                  <i class="cp-iconfont fa fa-html5"></i>
                  <div class="cp-bar-tab-label">进入H5版</div>
                </a>
              </div>
          </div>
        </div>

      </cp-view-box>


      <loading :show="isLoading" :text="loadingText"></loading>
    </div>
  </div>
</template>

<script>
import { querystring } from 'vux'
import cFuns from '../../utils/cFuns'
import config from './config'
import CpAvatar from '../../components/CpAvatar'
import CpTripBox from '../index/components/CpTripBox'
import CpViewBox from '../../components/CpViewBox'

export default {
  name: 'app',
  components: {
    CpTripBox,CpAvatar,CpViewBox
  },
  data () {
    return {
      isShowWxTips:false,
      isShowDownBtn: true,
      isLoading: true,
      isMobile: false,
      loadingText: "启动APP",
      h5Url:"/",
      r: "",
      id:"",
      sharer:"",
      detailData:null,
      clientType:null,
      user:null,
      statis:null,
    }
  },
  computed: {
    typeLabel (){
      return this.r=="info"?"乘客约车需求":"司机空座位";
    },
    statusText (){
      let status = parseInt(this.detailData.status);
      if(!this.detailData){
        return "..."
      }else{
        switch (this.r) {
          case "info":
            switch (status) {
              case 0:
                return "等待搭载"
                break;
              case 1:
                return "已搭车成功"
                break;
              case 2:
                return "已取消"
                break;
              case 3:
                return "已完成"
                break;
            }
            break;
          case "lovewall":
            if(status<2){
              return "剩余 <b>"+(this.detailData.seat_count-this.detailData.took_count)+"</b> 个空座位"
            }else if(status==2){
              return "空座位已取消"
            }else if(status==3){
              return "行程已完结"
            }
            break;
          default:

        }

      }
    }

  },

  watch: {

  },
  methods :{
    setMainMT(){
      //重新设定 mainbox的离顶高度
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      let mainHeight = this.$refs.mainbox.offsetHeight;
      let surHeight = h - mainHeight -100;
      console.log(mainHeight);

      if(surHeight > 0 ){
        let marginTop = 0.382 * surHeight;

        marginTop = marginTop > 50 ? marginTop : 50;

        this.$refs.mainbox.style.marginTop = marginTop + "px";
        console.log(this.$refs.mainbox.style.marginTop);
      }
    },

    //取得行程信息
    loadDetail(){
      let url =   config.urls.getTripDetail;
      this.$http.get(url,{params:{type:this.r,id:this.id}}).then(res => {
        if(res.data.code===0){
          var data = res.data.data;
          this.detailData = data;
          if( this.r == "info"){
            this.user                 = data.passenger_info
          }else{
            this.user                 = data.owner_info;
          }
        }
        setTimeout(()=>{
          this.setMainMT()
        },200)
      });
    },

    //跳转到对应页
    launchApp () {
      var myurl = config.appScheme+"://"+this.r+"?id="+this.id;

      var timeout = 2300, timer = null;
      var clientType = this.clientType;
      if(clientType.weixin) {
        this.isShowWxTips = true;
      } else {
        var startTime = Date.now();
        //如果客户端是安卓
        if(clientType.android) {
            var ifr = document.createElement('iframe');
            ifr.src = myurl;
            ifr.style.display = 'none';
            timer = setTimeout(()=>{
                var endTime = Date.now();
                if(!startTime || endTime - startTime < timeout + 300) {
                    document.body.removeChild(ifr);
                    this.isLoading = false;
                    // window.open("唤起失败跳转的链接");
                }
            }, timeout);
            document.body.appendChild(ifr);
        }
        //如果客户端是苹果
        if(clientType.ios || clientType.iPhone || clientType.iPad) {
            if(clientType.qq) {
              //提示在浏览器打开的蒙板
              this.isShowWxTips = true;
            } else {
                //document.body.appendChild(ifr);
                timer = setTimeout(()=>{
                   this.isLoading = false;
                    // window.location.href = "ios下载的链接";
                }, timeout);
                /*
                var ifr = document.createElement("iframe");
                ifr.src = myurl;
                ifr.style.display = "none"; //iOS9+不支持iframe唤起app
                */
                window.location.href = myurl;
            }
        }
        if(!clientType.mobile){

          this.isLoading =  false;
        }
      }
    },
  },
  created () {
    this.clientType = cFuns.getClientType();
    this.r = cFuns.getRequest('r');
    this.id = cFuns.getRequest('id');
    this.sharer = cFuns.getRequest('sharer');
    switch (this.r) {
      case "info":
        this.h5Url = this.h5Url+"#/carpool/requests/detail/"+this.id;
        break;
      case "lovewall":
        this.h5Url = this.h5Url+"#/carpool/rides/detail/"+this.id;
        break;
      default:
    }
    this.launchApp();
  },
  mounted () {
    this.loadDetail();

    /*setTimeout(()=>{
      this.init();
    },100)*/
  },


  activated () {



  }
}
</script>
