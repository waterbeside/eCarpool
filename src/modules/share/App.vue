<template>
  <div class="cp-all">
    <div id="app">
      <!-- 如果是在微信里打开则显示 -->
      <div class="wx-tips-wrap" v-show="isShowWxTips" style="">
  		    <img class="arrow-pic" src="../../assets/images/arrow-topright-s.png" >
  		    <h3>{{$t("message['carpool.detail.openInBrowser']")}}</h3>
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
              <cp-trip-box v-if="detailData" :start_name="detailData.start_info.addressname" :end_name="detailData.end_info.addressname" :labelStart="$t('message[\'label.from\']')"  :labelEnd="$t('message[\'label.to\']')"></cp-trip-box>
              <div class="cp-cell cp-cell-time">
                  <div class="la"><i class="fa fa-clock-o"></i></div>
                  <span class="cp-time">{{detailData.time_format}}</span>
                  <small class="cp-label">{{$t("message['label.startTime']")}}</small>
              </div>
              <div class="cp-cell ">
                  <div class="la"><i class="fa fa-info"></i></div>
                  <span v-html="statusText"></span>
              </div>
            </div>

            <div class="alert alert-warning" style="box-shadow: 0 0 10px rgba(0,0,0,.1);">
              {{$t("message['carpool.detail.autoStartTips']")}}
            </div>

          </div>
          <!-- 如果启动app失败则显示 -->
          <div class="cp-share-footer"  id="footer">
              <div class="router-link cp-bar-tab-item "  >
                <a href="http://m.esquel.cn/apps/gek/Carpool/downloadandroid.php">
                  <i class="cp-iconfont fa fa-android"></i>
                  <div class="cp-bar-tab-label">{{ $t("message['downloadapp.android']" )}}</div>
                </a>
              </div>
              <div   class="router-link cp-bar-tab-item">
                <a href="http://m.esquel.cn/apps/gek/Carpool/downloadios.php">
                  <i class="cp-iconfont fa fa-apple"></i>
                  <div class="cp-bar-tab-label">{{ $t("message['downloadapp.ios']" )}}</div>
                </a>
              </div>
              <div   class="router-link cp-bar-tab-item" >
                <a :href="h5Url">
                  <i class="cp-iconfont fa fa-html5"></i>
                  <div class="cp-bar-tab-label">{{ $t("message['launchH5']" )}}</div>
                </a>
              </div>
              <div   class="router-link cp-bar-tab-item cp-btn-go" >
                <a @click="launchApp" >
                  <i class="cp-iconfont fa fa-caret-right"></i>
                  <div class="cp-bar-tab-label">{{ $t("message['launchApp']" )}}</div>
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
      return this.r=="info"? this.$t("message['carpool.title.requests']") : this.$t("message['carpool.title.rides']");

      //
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
                return this.$t("message['carpool.status.waitingDriver']")
                break;
              case 1:
                return this.$t("message['carpool.status.hasTaken']");
                break;
              case 2:
                return this.$t("message['carpool.status.hasCanceled']");
                break;
              case 3:
                return this.$t("message['carpool.status.hasFinished']");
                break;
            }
            break;
          case "lovewall":
            if(status<2){
              return this.$t("message['carpool.detail.seatsLeftNum']",{"num":(this.detailData.seat_count-this.detailData.took_count)});
            }else if(status==2){
              return this.$t("message['carpool.status.hasCanceled']");
            }else if(status==3){
              return this.$t("message['carpool.status.hasFinished']");
            }
            break;
          default:

        }

      }
    },
    jumpAppUrl (){
      return config.appScheme+"://"+this.r+"?id="+this.id;
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

      if(surHeight > 0 ){
        let marginTop = 0.382 * surHeight;
        marginTop = marginTop > 50 ? marginTop : 50;
        this.$refs.mainbox.style.marginTop = marginTop + "px";
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
      this.isLoading = true;
      var myurl = this.jumpAppUrl;
      var timeout = 2300, timer = null;
      var clientType = this.clientType;
      var startTime = Date.now();
      //如果客户端是安卓
      if(clientType.android) {
          window.location.href = myurl;
          /*var ifr = document.createElement('iframe');
          ifr.src = myurl;
          document.body.appendChild(ifr);
          ifr.style.display ="none"*/
          // ifr.style.visibility = 'hidden';
          timer = setTimeout(()=>{
              var endTime = Date.now();
              this.isLoading = false;
              /*if(!startTime || endTime - startTime < timeout + 300) {
                  // document.body.removeChild(ifr);
                  this.isLoading = false;
                  // window.open("唤起失败跳转的链接");
              }*/
          }, timeout);
      }
      //如果客户端是苹果
      if(clientType.ios || clientType.iPhone || clientType.iPad) {
          if(clientType.qq) {
            //提示在浏览器打开的蒙板
            this.isShowWxTips = true;
          } else {
              timer = setTimeout(()=>{
                 this.isLoading = false;
                  // window.location.href = "ios下载的链接";
              }, timeout);
              /*
              var ifr = document.createElement("iframe");
              //document.body.appendChild(ifr);
              ifr.src = myurl;
              ifr.style.display = "none"; //iOS9+不支持iframe唤起app
              */
              window.location.href = myurl;
          }
      }
      if(!clientType.mobile){

        this.isLoading =  false;
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
        this.h5Url = this.h5Url+"#/carpool/requests/"+this.id;
        break;
      case "lovewall":
        this.h5Url = this.h5Url+"#/carpool/rides/"+this.id;
        break;
      default:
    }
    if(this.clientType.weixin) {
      this.isShowWxTips = true;
      this.isLoading = false;
    } else {
      this.launchApp();
    }
  },
  mounted () {
    this.loadDetail();
  },


  activated () {



  }
}
</script>
