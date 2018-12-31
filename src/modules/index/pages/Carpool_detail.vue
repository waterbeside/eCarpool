<template>
  <div class="page-view " id="Page-trip-detail" >
    <!-- <title-bar  :left-options="{showBack: true}">详情</title-bar> -->
    <div class="page-view-main "   >
      <title-bar  v-show="isSticky">
        <div class="text-center" >{{user.name}}</div>
      </title-bar>
      <cp-goback-btn v-show="!isSticky" :class="{'cp-sticky':isSticky}"></cp-goback-btn>

      <cp-scroller :enableInfinite="false" :enableRefresh="false" id="cp-scroll-wrapper" :innerStyle="{marginTop:(mapDefaultHeight-40)+'px'}" @on-scroll="onScroll"  ref="scroller">
        <div  slot="before-inner" id="mapContainer-detail" class="cp-map-content map-box" :style="{height:mapHeight+'px',marginTop:mapTop+'px'}"></div>

        <!-- <el-amap slot="before-inner" class="cp-map-content map-box" :vid="'amap-vue'" :events="mapEvents" :plugin="mapPlugin">  </el-amap> -->

        <div class="cp-main" ref="mainbox">
            <div class="cp-heading-wrapper"  >
              <div class="cp-department-bar">
                <h4 class="department">{{user.department_format}}</h4>
                <h6>{{typeLabel}}</h6>
              </div>
              <div class="cp-heading " >
                  <cp-avatar :src="user.avatar"></cp-avatar>
                  <div class="cp-name">
                    <h3>{{user.name}}</h3>
                  </div>
                  <div class="btns-bar">
                    <button><i class="fa fa-map-marker"></i></button>
                  </div>
              </div>

            </div>

          <group class="cp-group" >
            <group-title class="cp-group-title" slot="title">{{$t("message['detail']")}}</group-title>
            <div class="alert " :class="alertClass" v-show="isShowAlert" ><span v-html="alertText"></span>
              <a v-show="isShowBtn_cancel_alert" @click="btnAction('cancel')" style='margin-left:4px' class='btn btn-sm btn-info'>{{$t("message.cancel")}}</a>
              <a v-show="isShowBtn_finish_alert" @click="btnAction('finish')" style='margin-left:4px' class='btn btn-sm btn-info'>{{$t("message.finish")}}</a>
            </div>
            <div class="cp-cell cp-cell-time">
                <div class="la"><i class="fa fa-clock-o"></i></div>
                <span class="cp-time">{{detailData.time_format}}</span>
            </div>
            <cp-trip-box :start_name="detailData.start_addressname" :end_name="detailData.end_addressname" :labelStart="$t('message[\'label.from\']')"  :labelEnd="$t('message[\'label.to\']')"></cp-trip-box>
            <div class="cp-statis-list">
              <statis-item class="cp-statis-item col-xs-4 cp-time" :title="$t('message[\'label.startTime\']')"   icon="fa fa-clock-o" :duration="1"><b slot="num"  class="num" ><p class="date">{{detailData.time_format.split(' ')[0]}}</p>{{detailData.time_format.split(' ')[1]}}</b></statis-item>
              <statis-item class="cp-statis-item col-xs-4 cp-distance" :title="$t('message[\'carpool.detail.EstimatedDistance\']')"   :num="statis.distance" :unit="statis.distance_unit" icon="fa fa-map-signs" :duration="1"></statis-item>
              <statis-item class="cp-statis-item col-xs-4" v-if="type=='wall'"  :title="$t('message[\'carpool.detail.seatsLeft\']')"   :num="statis.surplus_count" icon="fa fa-car" :duration="1"></statis-item>
              <statis-item class="cp-statis-item col-xs-4 cp-status" v-if="type=='info'" :title="$t('message[\'carpool.detail.status\']')"     :icon="statusIcon" ><b slot="num"  class="num">{{statusText}}</b></b></statis-item>
            </div>

          </group>
          <!-- /详情 -->

          <group class="cp-group" v-if="type=='wall'">
            <group-title class="cp-group-title" slot="title">
              {{$t("message['carpool.passengers']")}}
               <badge :text="statis.took_count" v-show="statis.took_count > 0"></badge>
               <div class="cp-refresh pull-right" @click="loadPassengers"><i class="fa fa-refresh " :class="{'fa-spin':isLoading_pss}"></i></div>
            </group-title>
            <div class="text-center"  v-show="isLoading_pss">
              <spinner type="dots" size="60px"></spinner>
            </div>
            <div class="cp-wallView-passenger" v-if="passengers.length > 0">
              <passenger-item class="cp-item"
              :class="{'cp-finish':item.status==3}"
              v-for="(item,index) in passengers "
              :key = "index"
              :avatar = "item.avatar"
              :id = "item.id"
              :uid = "item.p_uid"
              :name = "item.p_name"
              :department = "item.p_department_format"
              :phone = "item.p_mobile"
              :start_name = "item.start_addressname"
              :end_name = "item.end_addressname"
              :time = "item.format_time"
              :data = "item"
              >
              </passenger-item>
           </div>
            <p class="cp-nodata-tips" v-else v-show="!isLoading_pss">{{$t("message['carpool.detail.noPassenger']")}}</p>
            <div class="blank10"> </div>
          </group>
          <!-- /乘客 -->

          <group class="cp-group" v-if="type=='wall'">
            <group-title class="cp-group-title" slot="title">
              {{$t("message['carpool.leaveMessage']")}}
              <badge :text="comments_total" v-show="comments_total > 0"></badge>
            </group-title>
            <div class="text-center"  v-show="isLoading_comments">
              <spinner type="dots" size="60px"></spinner>
            </div>
            <template v-if="comments.length">
              <ul class="cp-comment-list">
                <comment-item
                  v-for="(item,index) in comments "
                  :key = "index"
                  :avatar = "item.avatar"
                  :name = "item.name"
                  :time = "item.format_time"
                  :content = "item.content"
                ></comment-item>

                <li class="cp-commentLists-tips" ><router-link   :to="{ name:'carpool_rides_comments', params: {id: id} }">{{$t("message['carpool.detail.seeAllComments']",{"num":comments_total})}}</router-link></li>
              </ul>

            </template>

            <p class="cp-nodata-tips" v-else v-show="!isLoading_comments">{{$t("message['carpool.detail.noComment']")}}   (´°̥̥̥̥̥̥̥̥ω°̥̥̥̥̥̥̥̥｀)</p>
            <div class="text-center"><router-link class="btn btn-default"  :to="{ name:'carpool_rides_comments', params: {id: id} }"><i class="fa fa-edit"></i> {{$t("message['carpool.detail.addComment']")}}</router-link></div>
            <div class="blank20"> </div>

          </group>
          <!-- /留言 -->

        </div>
      </cp-scroller>
      <detail-btns-bar
      :user = "user"
      :uid = "uid"
      :detailData="detailData"
      :type = "type"
      v-if="detailData.time"
      @on-submit-success = "btnSubmitSuccess"
      > </detail-btns-bar>
    </div>
  </div>
</template>

<script>
import {GroupTitle,Tab, TabItem,Badge } from 'vux'
import config from '../config'
import cFuns from '@/utils/cFuns'
import cGmap from '@/utils/cGmap'
import cCoord from '@/utils/cCoord';

import CpAvatar from '@/components/CpAvatar'
import CpTripBox from '../components/CpTripBox'
import PassengerItem from '../components/CpTripPassengerItem'
import DetailBtnsBar from '../components/CpTripDetailBtns'
import CommentItem from '../components/CpTripComment'

import StatisItem from '@/components/StatisItem'


export default {
  components: {
    GroupTitle,Tab,TabItem, Badge,
    PassengerItem,CommentItem,CpAvatar,CpTripBox,StatisItem,DetailBtnsBar
  },
  data () {
    return {

      id                : this.$route.params.id,
      infoid            : 0,
      uid               : 0,
      tabIndex          : 0,
      isSticky          : false,
      type              : "",

      mapDefaultHeight  : 400,
      mapHeight         : 400,
      mapTop            : 0,

      detailData        : {
        time_format     : "0000-00-00 00:00",
        status          : 0,
        hasTake         : 0,
        hasTake_finish  : 0,
      },

      coord_d           : null,
      coord_p           : null,
      markers           : {
        driver: null,
        passenger: null,
      },

      //alert框相关
      isShowAlert       :false,
      alertText         :"",
      alertClass         :"alert-info",

      //留言相关
      isLoading_comments:false,
      comments          : [],
      comments_time     : 0,
      comments_total    : 0,

      //乘客相关
      isLoading_pss     :false,
      passengers        :[],
      passengers_time   : 0,

      //用户相关
      user              :{avatar:"-",name:"-"},
      defaultAvatar     : config.defaultAvatar,
      typeLabel         : '',

      //按钮相关
      isShowBtn_cancel_alert:false,
      isShowBtn_finish_alert: false,

      //statis-item组件相关
      statis            :{
        surplus_count:0,
        distance:0,
      },
      statusText        :"-",
      statusIcon        :"fa fa-car",

      //地图相关
      mapObj            :null,
      directionsDisplay : null,



    }

  },
  computed :{


  },
  watch :{
    "detailData.status" (val,oldval){
      console.log("parent:"+val);
      this.changeStatus(val);
    },
    type (val,oldval){
      this.changeStatus(this.detailData.status);
    },
    "coord_d" (val,oldval){
      if(!this.mapObj){
        return false;
      }
      if(this.markers.driver){
        return cGmap.removeMarker(this.markers.driver);
      }
      if(val){
        this.markers.driver = this.showUserCoord(val);
      }
    },
    "coord_p" (val,oldval){
      if(!this.mapObj){
        return false;
      }
      if(this.markers.passenger){
        return cGmap.removeMarker(this.markers.passenger);
      }
      if(val){
        this.markers.passenger = this.showUserCoord(val);
      }
    },
  },
  methods :{
    /**
     * 设置地图高度
     */
    setMapHeight(){
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      let mainHeight = this.$refs.mainbox.offsetHeight;
      let surHeight = h - mainHeight + 100  ;
      this.mapHeight =   surHeight > 150 ? surHeight : 200;
      this.$refs.scroller.$el.scrollTop = 100;
    },
    /**
     * 初始化地图
     */
     mapInit (){
      return new Promise ((resolve, reject) => {
        if(!this.mapObj){
          cGmap.showMap('mapContainer-detail',{autoCenter:false}).then(map=>{
            this.mapObj = map;
            resolve(map);
          }).catch(error=>{
            reject(error);
          })
        }else{
          resolve(this.mapObj);
        }

      })
    },
    /**
     * 返回按钮动作
     */
    goBack () {
        this.$router ? this.$router.back() : window.history.back();
    },
    /**
     * 改变状态后界面所做的变化
     */
    changeStatus(status){

      this.isShowBtn_cancel_alert = false;
      this.isShowBtn_finish_alert = false;

      this.isShowAlert = this.type=="info" ? true : false
      // console.log(this.type);
      switch (parseInt(status)) {
        case 0:
            this.alertText = this.$t("message['carpool.status.alert.waitingCar']");
            if(this.type=="wall"){
              if(this.detailData.hasTake > 0){
                  // this.isShowAlert = true;
                  this.alertClass  = "alert-info"
                  this.alertText = this.$t("message['carpool.status.alert.youAlreadyTake']");
                  this.isShowBtn_cancel_alert = true;
                  this.isShowBtn_finish_alert = true;
              }
            }
            this.statusText  = this.$t("message['carpool.status.waitingDriver']");
            this.statusIcon  = "fa fa-user";
          break;
        case 1:
            if(this.type=="wall"){
              if(this.detailData.hasTake > 0){
                  // this.isShowAlert = true;
                  this.alertClass  = "alert-info"
                  this.alertText = this.$t("message['carpool.status.alert.youAlreadyTake']");
                  this.isShowBtn_cancel_alert = true;
                  this.isShowBtn_finish_alert = true;
              }
            }
            if(this.type=="info"){
              this.alertText = this.$t("message['carpool.status.alert.hasTakenBy']",{"user":"<img class='cp-avatar' src='"+this.detailData.d_avatar+"' /> "+this.detailData.d_name+""});
            }

            this.statusText  = this.$t("message['carpool.status.hasTaken']");
            this.statusIcon  = "fa fa-car";
          break;
        case 2:
            this.alertText = this.$t("message['carpool.status.alert.hasCanceled']");
            this.statusText  = this.$t("message['carpool.status.hasCanceled']");
            this.statusIcon  = "fa fa-times";
          break;
        case 3:
            this.alertText = this.$t("message['carpool.status.alert.hasFinished']");
            this.statusText  = this.$t("message['carpool.status.hasFinished']");
            this.statusIcon  = "fa fa-check";
          break;
        default:
      }

    },
    //按钮提交成功后
    btnSubmitSuccess (action,res){
      console.log(action)
      switch (action) {
        case 'finish':
          if( this.uid == this.user.uid){
            this.detailData.status = 3;
            this.changeStatus(3);
          }else{
            this.loadPassengers();
            this.detailData.hasTake = 0;
            this.passengers_time = 0;
            this.isShowBtn_finish_alert = false;
            this.changeStatus(this.detailData.status);
          }
          break;
        case 'cancel':
          if( this.uid == this.user.uid){
            this.detailData.status = 2;
            this.changeStatus(2);
          }else{
            this.loadPassengers();
            this.statis.took_count          = this.statis.took_count - 1;
            this.statis.surplus_count       = this.statis.surplus_count + 1;
            this.detailData.took_count      = this.detailData.took_count - 1;
            this.detailData.took_count_all  = this.detailData.took_count_all - 1;
            this.detailData.hasTake = 0;
            // this.passengers  = this.passengers.filter(t => t.uid != this.user.uid);
            this.passengers_time = 0;
            this.isShowBtn_cancel_alert = false;
            this.changeStatus(this.detailData.status);
          }
          break;
        default:

      }
    },
    /**
     * 取得明细
     */
    getDetail (){
      // console.log(this.$store.state.userData.uid)
      return new Promise ((resolve, reject) => {

        // let url = this.type == "wall" ? config.urls.getRideDetail : config.urls.getRequestDetail;
        let url = config.urls.trips+"/"+this.type+"/"+this.id;
        this.$store.commit('setLoading',{isShow:true,text:null});

        // this.$http.get(url,{params:{id:this.id}}).then(res => {
        this.$http.get(url).then(res => {
          // console.log(res);
          if(res.data.code === 0) {
            let data = res.data.data;
            data.time_format = cFuns.formatDate((new Date(data.time*1000)),"yyyy-mm-dd hh:ii");
            this.detailData      = data;
            this.uid             = data.uid;
            this.detailData.d_avatar = data.d_imgpath ? config.avatarBasePath + data.d_imgpath : this.defaultAvatar;
            if( this.type == "info"){
              this.$store.commit('setCarpoolInfoDetail',this.detailData);
              this.$store.commit('setCarpoolWallDetail',null);

              this.typeLabel           = this.$t("message.passenger")
              this.passengers[0]       =  {
                                            name:data.p_name,
                                            avatar:data.p_imgpath ? config.avatarBasePath + data.p_imgpath :this.defaultAvatar ,
                                            department:data.p_department,
                                            department_format:data.p_full_department ? cFuns.formatDepartment(data.p_full_department) : data.p_department,
                                            phone:data.p_phone,
                                            mobile:data.p_mobile,
                                            uid:data.p_uid
                                            };
              this.isShowAlert          = true;
              this.user                 = this.passengers[0]

            }else{
              this.$store.commit('setCarpoolWallDetail',this.detailData);
              this.$store.commit('setCarpoolInfoDetail',null);

              this.typeLabel            = data.d_carnumber;
              this.user                 = {
                                            name:data.d_name,
                                            avatar:this.detailData.d_avatar,
                                            department:data.d_department,
                                            department_format:data.d_full_department ? cFuns.formatDepartment(data.d_full_department) : data.d_department,
                                            phone:data.d_phone,
                                            mobile:data.d_mobile,
                                            uid:data.d_uid
                                            };
              this.statis.seat_count    = data.seat_count;
              this.statis.took_count    = data.took_count;
              this.statis.surplus_count = data.seat_count - data.took_count;

            }
            this.user.phone           = this.user.mobile; //海外版暂时用mobile字段替换成phone字段
            console.log(data)
            this.changeStatus(data.status)
            // this.status = data.status;
            // this.mapObj.clearMap()

            this.$store.commit('setLoading',{isShow:false});
            // this.drawTripLine(data);
            resolve(data)
            // setTimeout(function(){
            //
            // },1000)

          }else{
            reject(res);
            this.$store.commit('setLoading',{isShow:false});
          }
        })
        .catch(error => {
          this.$store.commit('setLoading',{isShow:false});
          console.log(error);
          reject(error);
        })

      })

    },

    drawTripLine (data){
      let start = {lat:data.start_latitude,lng:data.start_longitude}
      let end = {lat:data.end_latitude,lng:data.end_longitude}
      if(this.directionsDisplay) this.directionsDisplay.setMap(null);

      cGmap.drawTripLine(start, end,this.mapObj).then((res)=>{
        // console.log(res);
        if(res.status == 'OK'){
          this.directionsDisplay = res.directionsDisplay;
          var leg = res.results.routes[0].legs[0];
          var distance = leg.distance.value; //计出的距离
          var dtTime = leg.duration.value;
          var distanceStr = leg.distance.text;
          var dtTimeStr = leg.duration.text;
          var distanceObj = cGmap.formatDistance(distance,1);
          this.statis.distance = parseFloat(distanceObj.distance);
          this.statis.distance_unit = distanceObj.unit;
        }else{
          this.statis.distance = 0;
        }
      })


    },
    /**
     * 当显示乘客列表的tab时。
     */
    showPassengers (){
      if(this.passengers.length > 0){
        return false;
      }
      var nowTimestamp = new Date().getTime();
      if( nowTimestamp - this.passengers_time < 20*1000 ||(this.passengers.length > 0 && (nowTimestamp - this.passengers_time < 60*1000))){
        return false
      }
      this.loadPassengers();
    },
    /**
     * 读取空座位乘客列表
     */
    loadPassengers (){
      if(this.isLoading_pss){
        return false;
      }
      this.isLoading_pss = true;
      let params = {wallid:this.id}
      // this.$http.get(config.urls.getRidePassengers,{params:params}).then(res => {
      this.$http.get(config.urls.trips+"/wall/"+this.id+"/passengers",{params:params}).then(res => {

        let data = res.data.data;

        if(res.data.code === 0) {
          data.lists.forEach((value,index,arr)=>{
            value.avatar = value.p_imgpath ? config.avatarBasePath + value.p_imgpath : this.defaultAvatar;
            value.format_time = cFuns.formatDate((new Date(value.time*1000)),"yyyy-mm-dd hh:ii");
            value.p_department_format = value.p_full_department ? cFuns.formatDepartment(value.p_full_department) : value.p_department;

          })
          this.passengers = data.lists;
          this.statis.took_count = this.passengers.length;
          this.passengers_time = new Date().getTime();
        }else{

        }
        setTimeout(()=>{
          this.isLoading_pss = false;
        },1000)
      })
      .catch(error => {
        console.log(error)
        setTimeout(()=>{
          this.isLoading_pss = false;
        },1000)
      })
    },

    /**
      * 取得评论总数
      */
     getCommentsCount (){
       let params = {wid:this.id,getcount:1}
       this.$http.get(config.urls.wallComments,{params:params}).then(res => {
         if(res.data.code == 0){
           var data = res.data.data;
           this.comments_total = data.total;

           // console.log(this.comments_total)
         }
       });
     },

     /**
     * 取得评论列表数据
     */
     getCommentLists (){
       var nowTimestamp = new Date().getTime();
       if(this.comments.length > 3  || nowTimestamp - this.comments_time < 60*1000){
         return false;
       }
       this.isLoading_comments = true;

       let params = {wid:this.id,num:3}
       this.$http.get(config.urls.trips+"/wall/"+this.id+"/comments",{params:params}).then(res => {
         // console.log(res);
         this.isLoading_comments = false;
         if(res.data.code == 0){
           var data = res.data.data;
           data.lists.forEach((value,index,arr)=>{
             value.avatar = value.imgpath ? config.avatarBasePath + value.imgpath : this.defaultAvatar;
             value.format_time = cFuns.formatDate((new Date(value.time*1000)),"yyyy-mm-dd hh:ii");
           })
           this.comments_total = data.total ? data.total : 0;
           this.comments = data.lists;
           this.comments_time = nowTimestamp;
         }
       }).catch(error => {
         this.isLoading_comments = false;
         console.log(error)
       });
     },

     /**
      * 拉取用户坐标
      */
     getUserCoord (uid,type = 0, showToast = 1){
       return new Promise ((resolve, reject) => {
         cCoord().pull(uid).then((res)=>{
           if(res.code === 0 ){
             if(type){
               this.coord_p = res.data;
             }else{
               this.coord_d = res.data;
             }
           }
           return resolve(res);
         }).catch(error=>{
           console.log(error)
           return reject(error);
         });
       })
     },
     /**
      * 显示用户坐标
      */
     showUserCoord (data,setting){
       var position = {lat:data.latitude,lng:data.longitude};
       var image = {
          url: require('@/assets/images/car.png'),
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(20, 40),
          // // The origin for this image is (0, 0).
          // origin: new google.maps.Point(0, 0),
          // // The anchor for this image is the base of the flagpole at (0, 32).
          // anchor: new google.maps.Point(0, 20)
        };
        // Shapes define the clickable region of the icon. The type defines an HTML
        // <area> element 'poly' which traces out a polygon as a series of X,Y points.
        // The final coordinate closes the poly by connecting to the first coordinate.
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };
        var mapObj = this.mapObj;
        var defaults = {
          position:position,
          map: mapObj,
          icon: image,
          // shape: shape,
          title: '司机',
          zIndex: 2
        }

      // return cGmap.addMarker({lat: 22.9054378951, lng: 112.8592886032},mapObj,defaults);
       return cGmap.addMarker(defaults);
     },
     /**
      * 滚动事件
      */
     onScroll(e){
       let sTop = e.target.scrollTop;
       this.mapTop    =  sTop;
       this.mapHeight =  this.mapDefaultHeight -  sTop ;
       if(sTop > this.mapHeight){
         this.isSticky = true;
       }else{
         this.isSticky = false;
       }
       this.$store.commit('setCarpoolDetailScrollTop',sTop);
     }


  },

  created () {

  },
  mounted () {
  //   console.log(lazyAMapApiLoaderInstance)
  //   lazyAMapApiLoaderInstance.load().then(() => {
  // // your code ...
  //   alert(1)
  //     this.map = new AMap.Map('amapContainer', {
  //       center: new AMap.LngLat(121.59996, 31.197646)
  //     });
  //   });
  },
  activated (){
    let path = this.$route.path;
    if(path.indexOf('requests')>1){
      this.type =  'info';
    }
    if(path.indexOf('rides')>1){
      this.type =  'wall';
    }
    //
    this.id = this.$route.params.id;
    cCoord().push().catch(err=>{console.log(err)}); // 上传用户坐标。
    if(!this.$store.state.unRefreshCarpoolDetail){
      if(this.markers.driver){
         cGmap.removeMarker(this.markers.driver);
      }
      if(this.markers.passenger){
         cGmap.removeMarker(this.markers.passenger);
      }
      this.tabIndex   = 0;
      this.isSticky   = false;
      this.passengers = [];
      this.passengers_time = 0 ;
      this.comments          = [];
      this.comments_time     = 0;
      this.comments_total    = 0;
      this.coord_d     = null;
      this.coord_p     = null;
      this.markers     = {
        driver: null,
        passenger: null,
      };
      this.detailData =  {
        time_format     : "0000-00-00 00:00",
        start_info      : {addressname:'-'},
        end_info        : {addressname:'-'},
        status          : 0,
        hasTake         : 0,
        hasTake_finish  : 0,

      }


      this.getDetail().then(res=>{
        this.mapInit().then(map=>{
          this.drawTripLine(res);
          this.getUserCoord(res.d_uid);
        });
      })

      if(this.type=="wall"){
        this.getCommentsCount();
        this.getCommentLists();
        this.showPassengers();
      }


      setTimeout(()=>{
        this.setMapHeight();
      },800)
    }else{
      this.$refs.scroller.$el.scrollTop = this.$store.state.carpoolDetailScrollTop;
    }


  },
  deactivated () {

  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "carpool_rides"  || to.name == "carpool_requests") {
        to.meta.keepAlive = true;
        this.$store.commit('setUnRefreshCarpoolDetail',false);
    }
    if (to.name == "carpool_position_info" || to.name == "carpool_position" ){
      this.$store.commit('setUnRefreshCarpoolDetail',true);
    }
    next();
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  #Page-trip-detail {
    .cp-scroll {top:0;
      section.cp-scroll-inner { top:0}
    }
  }
</style>
