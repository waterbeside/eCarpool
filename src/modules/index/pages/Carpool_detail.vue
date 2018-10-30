<template>
  <div class="page-view " id="Page-trip-detail" >
    <!-- <title-bar  :left-options="{showBack: true}">详情</title-bar> -->
    <div class="page-view-main "   >
      <title-bar  v-show="isSticky">
        <div class="text-center" >{{user.name}}</div>
      </title-bar>
      <cp-goback-btn v-show="!isSticky" :class="{'cp-sticky':isSticky}"></cp-goback-btn>

      <cp-scroller :enableInfinite="false" :enableRefresh="false" id="cp-scroll-wrapper" @on-scroll="onScroll" :innerStyle="{marginTop:(mapHeight-40)+'px'}">
        <div  slot="before-inner" id="amapContainer" class="cp-map-content map-box" :style="{height:mapHeight+'px'}"></div>

        <!-- <el-amap slot="before-inner" class="cp-map-content map-box" :vid="'amap-vue'" :events="mapEvents" :plugin="mapPlugin">  </el-amap> -->

        <div class="cp-main" ref="mainbox">
          <div scroll-box="cp-scroll-wrapper" ref="sticky" :offset="0" >
            <div class="cp-heading-wrapper" :class="{'cp-sticky':isSticky}" >
              <div class="cp-heading " >
                  <cp-avatar :src="user.avatar"></cp-avatar>
                  <div class="cp-txt">
                    <h3>{{user.name}}</h3>
                  </div>
                  <h6>{{typeLabel}}</h6>
                  <h4 class="department">{{user.Department}}</h4>
              </div>
              <div class="cp-heading-bg" ></div>
              <!-- / heading -->
              <tab class="cp-tab-wrapper" :line-width="2" active-color='#8877ba' v-model="tabIndex" v-if="type=='wall'" >
                <tab-item class="cp-tab-item"  :key="0"><div class="cp-inner">{{$t("message.detail")}}</div></tab-item>
                <tab-item class="cp-tab-item"  :key="1" @on-item-click="getCommentLists"><div class="cp-inner">{{$t("message['carpool.leaveMessage']")}}<b class="bage" v-show="comments_total>0">{{comments_total}}</b></div></tab-item>
                <tab-item class="cp-tab-item"  :key="2" @on-item-click="onShowPassengers" ><div class="cp-inner">{{$t("message['carpool.passengers']")}}<b class="bage" v-show="detailData.took_count_all>0">{{detailData.took_count_all}}</b></div></tab-item>
              </tab>
            </div>

          </div>
          <div class="cp-content-item" :key="0" v-show="tabIndex == 0">

              <div class="alert " :class="alertClass" v-show="isShowAlert" ><span v-html="alertText"></span>
                <a v-show="isShowBtn_cancel_alert" @click="btnAction('cancel')" style='margin-left:4px' class='btn btn-sm btn-info'>{{$t("message.cancel")}}</a>
                <a v-show="isShowBtn_finish_alert" @click="btnAction('finish')" style='margin-left:4px' class='btn btn-sm btn-info'>{{$t("message.finish")}}</a>
              </div>
              <div class="cp-cell cp-cell-time">
                  <div class="la"><i class="fa fa-clock-o"></i></div>
                  <span class="cp-time">{{detailData.time_format}}</span>
              </div>
              <cp-trip-box :start_name="detailData.start_info.addressname" :end_name="detailData.end_info.addressname" :labelStart="$t('message[\'label.from\']')"  :labelEnd="$t('message[\'label.to\']')"></cp-trip-box>
              <div class="cp-statis-list">
                <statis-item class="cp-statis-item col-xs-4 cp-time" :title="$t('message[\'label.startTime\']')"   icon="fa fa-clock-o" :duration="1"><b slot="num"  class="num"><p class="date">{{detailData.time_format.split(' ')[0]}}</p>{{detailData.time_format.split(' ')[1]}}</b></statis-item>
                <statis-item class="cp-statis-item col-xs-4 cp-distance" :title="$t('message[\'carpool.detail.EstimatedDistance\']')"   :num="statis.distance" :unit="statis.distance_unit" icon="fa fa-map-signs" :duration="1"></statis-item>
                <statis-item class="cp-statis-item col-xs-4" v-if="type=='wall'"  :title="$t('message[\'carpool.detail.seatsLeft\']')"   :num="statis.surplus_count" icon="fa fa-car" :duration="1"></statis-item>
                <statis-item class="cp-statis-item col-xs-4 cp-status" v-if="type=='info'" :title="$t('message[\'carpool.detail.status\']')"     :icon="statusIcon" ><b slot="num"  class="num">{{statusText}}</b></b></statis-item>
              </div>
            <!--  <div class="cp-btns-wrap">
                <a v-show="isShowBtn_phone"  class="cp-btn cp-btn-phone " :href="'tel:'+user.phone"><i class="cp-icon fa fa-phone"></i>电 话</a>
                <a v-show="isShowBtn_goback" class="cp-btn cp-btn-back "  @click="goBack"><i class="cp-icon fa fa-arrow-left"></i>返 回</a>
                <a v-show="isShowBtn_pickup" class="cp-btn cp-btn-pickup " @click="btnAction('pickup')"><i class="cp-icon fa fa-car"></i>接受请求</a>
                <a v-show="isShowBtn_riding" class="cp-btn cp-btn-riding " @click="btnAction('riding')"><i class="cp-icon fa fa-car"></i>搭 车</a>
                <a v-show="isShowBtn_cancel" class="cp-btn cp-btn-cancel "  @click="btnAction('cancel')"><i class="cp-icon fa fa-times"></i>取消行程</a>
                <a v-show="isShowBtn_finish" class="cp-btn cp-btn-ok "  @click="btnAction('finish')"><i class="cp-icon fa fa-check"></i>结束行程</a>
              </div>-->

          </div>

          <!-- /详情 -->
          <div class="cp-content-item" :key="1" v-show="tabIndex == 1" >
            <div class="text-center"  v-show="isLoading_comments">
              <spinner type="dots" size="60px"></spinner>
            </div>
            <template v-if="comments.length">
              <ul class="cp-comment-list">
                <li v-for="(item,index) in comments" class="cp-comment-item">
                  <div class="cp-avatarbox">
                    <cp-avatar :src="item.avatar"></cp-avatar>
                  </div>
                  <div class="cp-mainbox">
                    <div class="cp-title">
                      <b class="name">{{item.name}}</b>
                      <span class="time">{{item.time}}</span>
                    </div>
                    <div class="cp-content">{{item.content}}</div>
                  </div>
                </li>
                <li class="cp-commentLists-tips" ><router-link   :to="{ name:'carpool_rides_comments', params: {id: id} }">{{$t("message['carpool.detail.seeAllComments']",{"num":comments_total})}}</router-link></li>
              </ul>

            </template>

            <p class="cp-nodata-tips" v-else v-show="!isLoading_comments">{{$t("message['carpool.detail.noComment']")}}   (´°̥̥̥̥̥̥̥̥ω°̥̥̥̥̥̥̥̥｀)</p>
            <div class="text-center"><router-link class="btn btn-default"  :to="{ name:'carpool_rides_comments', params: {id: id} }"><i class="fa fa-edit"></i> {{$t("message['carpool.detail.addComment']")}}</router-link></div>
          </div>
          <!-- /留言 -->

          <div class="cp-content-item" :key="2" v-show="tabIndex == 2">
            <div class="text-center"  v-show="isLoading_pss">
              <spinner type="dots" size="60px"></spinner>
            </div>
            <ul class="cp-wallView-passenger" v-if="passengers.length > 0">
              <li class="cp-item " :class="{'cp-finish':item.status==3}" v-for="(item,index) in passengers ">
                <cp-avatar :src="item.avatar" ></cp-avatar>
                <div class="cp-txt">
                  <h4 class="media-heading">{{item.name}}</h4>
                  <p>{{item.Department}}</p>
                </div>
                <div class="cp-btns-wrap">
                  <a :href="'tel:'+item.phone" class="btn  btn-fab btn-fab-mini"><i class="fa fa-phone"></i></a>
                </div>
             </li>
            </ul>
            <p class="cp-nodata-tips" v-else v-show="!isLoading_pss">{{$t("message['carpool.detail.noPassenger']")}}</p>
          </div>
          <!-- /乘客 -->

          <!-- /tab -->


        </div>
      </cp-scroller>
      <div  class="cp-btns-wrapper">
        <a v-show="isShowBtn_goback" class="cp-btn-i cp-btn-back "  @click="goBack"><i class="cp-icon fa fa-chevron-left"></i><span>{{$t("message['carpool.detail.btn.goback']")}}</span></a>
        <a v-show="isShowBtn_phone"  class="cp-btn-i cp-btn-phone " :href="'tel:'+user.phone"><i class="cp-icon fa fa-phone"></i><span>{{$t("message['carpool.detail.btn.phone']")}}</span></a>
        <a v-show="isShowBtn_pickup" class="cp-btn-p cp-btn-pickup " @click="btnAction('pickup')"><i class="cp-icon fa fa-car"></i><span>{{$t("message['carpool.detail.btn.pickup']")}}</span></a>
        <a v-show="isShowBtn_riding" class="cp-btn-p cp-btn-riding " @click="btnAction('riding')"><i class="cp-icon fa fa-car"></i><span>{{$t("message['carpool.detail.btn.riding']")}}</span></a>
        <a v-show="isShowBtn_cancel" class="cp-btn-p cp-btn-cancel "  @click="btnAction('cancel')"><i class="cp-icon fa fa-times"></i><span>{{$t("message['carpool.detail.btn.cancel']")}}</span></a>
        <a v-show="isShowBtn_finish" class="cp-btn-p cp-btn-ok "  @click="btnAction('finish')"><i class="cp-icon fa fa-check"></i><span>{{$t("message['carpool.detail.btn.finish']")}}</span></a>
        <b v-show="isShowBtn_status" class="cp-btn-p cp-btn-disable "  @click="false"><i class="cp-icon fa fa-check"></i><span>{{alertText}}</span></b>
      </div>
    </div>
  </div>
</template>

<script>
import config from '../config'
import cFuns from '@/utils/cFuns'
import {Tab, TabItem} from 'vux'
import { lazyAMapApiLoaderInstance } from 'vue-amap';


import CpAvatar from '@/components/CpAvatar'
import CpTripBox from '../components/CpTripBox'

import StatisItem from '@/components/StatisItem'


export default {
  components: {
    CpAvatar,CpTripBox,StatisItem,Tab,TabItem
  },
  data () {
    return {

      id                : this.$route.params.id,
      infoid            : 0,
      uid               : 0,
      tabIndex          : 0,
      isSticky          : false,
      type              : "",

      mapHeight         : 220,

      detailData        : {
        time_format    : "0000-00-00 00:00",
        start_info      : {addressname:'-'},
        end_info        :{addressname:'-'},
        status          : 0,
        hasTake         : 0,
        hasTake_finish  : 0,

      },

      //alert框相关
      isShowAlert       :false,
      alertText         :"",
      alertClass         :"alert-info",

      //留言相关
      isLoading_comments:true,
      comments          : [],
      comments_time     : 0,
      comments_total    : 0,

      //乘客相关
      isLoading_pss     :true,
      passengers        :[],
      passengers_time   : 0,

      //用户相关
      user              :{avatar:"-",name:"-"},
      defaultAvatar     : config.defaultAvatar,
      typeLabel         : '',

      //按钮相关
      isShowBtn_phone   :false,
      isShowBtn_goback  :false,
      isShowBtn_pickup  :false,
      isShowBtn_riding  :false,
      isShowBtn_cancel  :false,
      isShowBtn_finish :false,
      isShowBtn_cancel_alert:false,
      isShowBtn_finish_alert: false,
      isShowBtn_status : false,

      //statis-item组件相关
      statis            :{
        surplus_count:0,
        distance:0
      },
      statusText        :"-",
      statusIcon        :"fa fa-car",

      //地图相关
      mapObj            :null,


    }

  },
  computed :{


  },
  watch :{
    "detailData.status" (val,oldval){
      this.changeStatus(val);
    },
    type (val,oldval){
      this.changeStatus(this.detailData.status);
    }
  },
  methods :{
    /**
     * 设置地图高度
     */
    setMapHeight(){
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      let mainHeight = this.$refs.mainbox.offsetHeight;
      let surHeight = h - mainHeight  ;

      this.mapHeight = surHeight > 220 ? surHeight : 220;

    },
    /**
     * 初始化地图
     */
     mapInit (){
      return new Promise ((resolve, reject) => {
        if(!this.mapObj){
          lazyAMapApiLoaderInstance.load().then(() => {
            this.mapObj = cFuns.amap.showMap('amapContainer', {
              resizeEnable: true,zoom: 10,enableHighAccuracy:true, zoomToAccuracy:false,
            },res=>{
              if(!this.$store.state.localCity){
                cFuns.amap.getCity(this.mapObj).then((data)=> {
                  if (data['province'] && typeof data['province'] === 'string') {
                    this.$store.commit('setLocalCity',data);
                    this.city = data.city
                  }
                });
              }
              resolve(this.mapObj);
            })
          }).catch((error) => {
              reject(error);
            }
          );
        }else{
          this.mapObj.clearMap();
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
      this.isShowBtn_phone   = false;
      this.isShowBtn_goback  = true;
      this.isShowBtn_pickup  = false;
      this.isShowBtn_riding  = false;
      this.isShowBtn_cancel  = false;
      this.isShowBtn_finish= false;
      this.isShowBtn_cancel_alert = false;
      this.isShowBtn_finish_alert = false;
      this.isShowBtn_status = false;

      this.isShowBtn_phone = this.uid == this.user.uid ? false : true;
      this.isShowAlert = this.type=="info" ? true : false
      // console.log(this.type);
      switch (parseInt(status)) {
        case 0:
            this.alertText = this.$t("message['carpool.status.alert.waitingCar']");
            this.isShowBtn_cancel = this.uid == this.user.uid ? true : false;
            if(this.type=="wall"){
              this.isShowBtn_finish = this.uid == this.user.uid ? true : false;
              if(this.detailData.hasTake > 0){
                  // this.isShowAlert = true;
                  this.alertClass  = "alert-info"
                  this.alertText = this.$t("message['carpool.status.alert.youAlreadyTake']");

                  this.isShowBtn_cancel_alert = true;
                  this.isShowBtn_cancel = true;
                  this.isShowBtn_finish_alert = true;
                  this.isShowBtn_finish = true;
                  this.isShowBtn_goback =  true;
              }else if(this.detailData.hasTake_finish > 0){
                this.isShowBtn_goback = true;
              }else{
                this.isShowBtn_riding = this.uid == this.user.uid ? false : true;
              }
            }
            if(this.type=="info"){
              this.isShowBtn_pickup = this.uid == this.user.uid ? false : true;
            }
            this.statusText  = this.$t("message['carpool.status.waitingDriver']");;
            this.statusIcon  = "fa fa-user";
          break;
        case 1:
            if(this.type=="wall"){
              this.isShowBtn_cancel = this.uid == this.user.uid ? true : false;
              this.isShowBtn_finish = this.uid == this.user.uid ? true : false;
              if(this.detailData.hasTake > 0){
                  // this.isShowAlert = true;
                  this.alertClass  = "alert-info"
                  this.alertText = this.$t("message['carpool.status.alert.youAlreadyTake']");
                  this.isShowBtn_cancel_alert = true;
                  this.isShowBtn_cancel = true;
                  this.isShowBtn_finish_alert = true;
                  this.isShowBtn_finish = true;
                  this.isShowBtn_goback =  true;
              }else if(this.detailData.hasTake_finish > 0){
                this.isShowBtn_goback = true;
              }else{
                this.isShowBtn_riding = this.uid == this.user.uid ? false : true;
              }


            }
            if(this.type=="info"){
              this.alertText = this.$t("message['carpool.status.alert.hasTakenBy']",{"user":"<img class='cp-avatar' src='"+this.detailData.owner_info.avatar+"' /> "+this.detailData.owner_info.name+""});
              this.isShowBtn_cancel = this.uid == this.user.uid || this.detailData.owner_info.uid == this.uid ? true : false;
              this.isShowBtn_finish = this.uid == this.user.uid || this.detailData.owner_info.uid == this.uid ? true : false;
            }

            this.statusText  = this.$t("message['carpool.status.hasTaken']");
            this.statusIcon  = "fa fa-car";
          break;
        case 2:
            this.alertText = this.$t("message['carpool.status.alert.hasCanceled']");
            this.isShowBtn_goback =  true;
            this.statusText  = this.$t("message['carpool.status.hasCanceled']");
            this.statusIcon  = "fa fa-times";
            this.isShowBtn_status = true;
          break;
        case 3:
            this.alertText = this.$t("message['carpool.status.alert.hasFinished']");
            this.isShowBtn_goback = true;
            this.statusText  = this.$t("message['carpool.status.hasFinished']");
            this.statusIcon  = "fa fa-check";
            this.isShowBtn_status = true;

          break;
        default:
      }

    },
    /**
     * 取得明细
     */
    getDetail (){
      return new Promise ((resolve, reject) => {

        let url = this.type == "wall" ? config.urls.getRideDetail : config.urls.getRequestDetail;
        this.$store.commit('setLoading',{isShow:true,text:null});

        this.$http.get(url,{params:{id:this.id}}).then(res => {
          // console.log(res);
          if(res.data.code === 0) {
            let data = res.data.data;
            this.detailData      = data;
            this.uid             = data.uid;
            this.detailData.owner_info.avatar = data.owner_info.imgpath ? config.avatarBasePath + data.owner_info.imgpath : this.defaultAvatar;
            if( this.type == "info"){
              this.typeLabel           = this.$t("message.passenger")
              this.passengers[0]       = data.passenger_info;
              this.passengers[0].avatar = data.passenger_info.imgpath ? config.avatarBasePath + this.passengers[0].imgpath :this.defaultAvatar ;
              this.isShowAlert          = true;
              this.user                 = data.passenger_info

            }else{
              this.typeLabel            = data.owner_info.carnumber;
              this.user                 = data.owner_info;
              this.user.phone           = this.user.mobile; //海外版暂时用mobile字段替换成phone字段
              this.statis.seat_count    = data.seat_count;
              this.statis.took_count    = data.took_count;
              this.statis.surplus_count = data.seat_count - data.took_count;

            }
            this.changeStatus(data.status)
            // this.status = data.status;
            // this.mapObj.clearMap()


            this.$store.commit('setLoading',{isShow:false});
            this.drawTripLine(data);
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
      let start = [data.start_info.longtitude,data.start_info.latitude]
      let end = [data.end_info.longtitude,data.end_info.latitude]
      cFuns.amap.drawTripLine(start, end,this.mapObj,(status,result)=>{
        if(status == 'complete'){
          this.isShowComputebox = true;
          var distance = result.routes[0].distance; //计出的距离
          var distanceObj = cFuns.amap.formatDistance(distance,1);
          // var distanceStr = distanceObj.distance + distanceObj.unit;
          var dtTime = result.routes[0].time;
          var dtTimeStr = cFuns.amap.formatTripTime(dtTime);

          this.statis.distance = parseFloat(distanceObj.distance);
          this.statis.distance_unit = distanceObj.unit;
        }else{
          this.statis.distance = 0;
        }
      });
    },
    /**
     * 当显示乘客列表的tab时。
     */
    onShowPassengers (){
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
      this.isLoading_pss = true;
      let params = {wallid:this.id}
      this.$http.get(config.urls.getRidePassengers,{params:params}).then(res => {

        let data = res.data.data;
        this.isLoading_pss = false;
        if(res.data.code === 0) {
          data.lists.forEach((value,index,arr)=>{
            value.avatar = value.imgpath ? config.avatarBasePath + value.imgpath : this.defaultAvatar;
          })
          this.passengers = data.lists;
          this.took_count = this.passengers.length;
          this.passengers_time = new Date().getTime();
        }else{

        }
      })
      .catch(error => {
        console.log(error)
        this.isLoading_pss = false;

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
       if(this.comments.length > 5  || nowTimestamp - this.comments_time < 60*1000){
         return false;
       }
       this.isLoading_comments = true;

       let params = {wid:this.id,num:5}
       this.$http.get(config.urls.wallComments,{params:params}).then(res => {
         // console.log(res);
         this.isLoading_comments = false;
         if(res.data.code == 0){
           var data = res.data.data;
           data.lists.forEach((value,index,arr)=>{
             value.avatar = value.imgpath ? config.avatarBasePath + value.imgpath : this.defaultAvatar;
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
     /******* 按钮相关方法 *******/
     /**
      * 按钮动作
      */
     btnAction (action){
       var url,postData,confirmText;
       var successText = this.$t("message.success");
       var confirmTitle = this.$t("message.AreYouSure");
       var isJumpToMytrip = false;
       switch (action) {
         case 'pickup':
           url = config.urls.acceptRequest;
           postData = {id:this.id};
           confirmText = this.$t("message['carpool.confirm.accept']",{"username":this.user.name});
           successText = this.$t("message['carpool.acceptSuccess']") ;
           isJumpToMytrip = true;
           break;
         case 'riding':
           url = config.urls.riding;
           postData = {wid:this.id};
           confirmText = this.$t("message['carpool.confirm.riding']",{"username":this.user.name});
           successText = this.$t("message['carpool.ridingSuccess']") ;
           isJumpToMytrip = true;
           break;
         case 'finish':
           url = config.urls.finishTrip;
           postData = {id:this.id,from:this.type};
           confirmText = this.$t("message['carpool.confirm.finish']");
           successText = this.$t("message['carpool.finishSuccess']") ;
           isJumpToMytrip = false;
           var success = (rs)=>{
             if( this.uid == this.user.uid){
               this.detailData.status = 3;
               this.changeStatus(3);
             }else{
               this.statis.took_count      = this.statis.took_count - 1;
               this.detailData.took_count  = this.detailData.took_count - 1;
               this.detailData.hasTake = 0;
               this.passengers_time = 0;
               this.isShowBtn_finish_alert = false;

               this.changeStatus(this.detailData.status);
             }
           }
           break;
         case 'cancel':
           url = config.urls.cancelTrip;
           postData = {id:this.id,from:this.type};
           confirmText = this.$t("message['carpool.confirm.cancel']");
           successText = this.$t("message['carpool.cancelSuccess']") ;
           isJumpToMytrip = false;
           var success =  (rs)=>{
             if( this.uid == this.user.uid){
               this.detailData.status = 2;
               this.changeStatus(2);
             }else{
               this.statis.took_count          = this.statis.took_count - 1;
               this.detailData.took_count      = this.detailData.took_count - 1;
               this.detailData.took_count_all  = this.detailData.took_count_all - 1;
               this.detailData.hasTake = 0;
               // this.passengers  = this.passengers.filter(t => t.uid != this.uid);
               this.passengers_time = 0;
               this.isShowBtn_cancel_alert = false;

               this.changeStatus(this.detailData.status);
             }
           }
           break;
       }
       // event.stopPropagation();
       this.$vux.confirm.show({
         title  : confirmTitle,
         content: confirmText,
         onConfirm : ()=>{
           this.$store.commit('setLoading',{isShow:true,text:this.$t("message.submitting")});
           // return false;
           this.$http.post(url,postData).then(res => {
             this.$store.commit('setLoading',{isShow:false});
             if(res.data.code === 0) {
               this.$vux.toast.text(successText);
               if(typeof(success)==="function"){
                 success(res.data);
               }
               if(isJumpToMytrip){
                 this.$store.commit('setJumpTo',{name:"carpool_mytrip"});
                 this.$router.push({name:'carpool'});
               }
             }else{
               this.$vux.toast.text(res.data.desc,'middle');
             }
           })
           .catch(error => {
             this.$store.commit('setLoading',{isShow:false});
             this.$vux.toast.text(t.message['networkFail']);
             console.log(error)
           })
         }
       })
     },
     /**
      * 滚动事件
      */
     onScroll(e){
       let sTop = e.target.scrollTop;
       if(sTop > this.mapHeight){
         this.isSticky = true;
       }else{
         this.isSticky = false;
       }
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
    this.tabIndex   = 0;
    this.isSticky   = false;
    this.passengers = [];
    this.passengers_time = 0 ;
    this.comments          = [];
    this.comments_time     = 0;
    this.comments_total    = 0;
    this.detailData =  {
      time_format    : "0000-00-00 00:00",
      start_info      : {addressname:'-'},
      end_info        :{addressname:'-'},
      status          : 0,
      hasTake         : 0,
      hasTake_finish  : 0,

    }
    let path = this.$route.path;


    if(path.indexOf('requests')>1){
      this.type =  'info';
    }
    if(path.indexOf('rides')>1){
      this.type =  'wall';
    }

    //
    this.id = this.$route.params.id;
    Promise.all([this.mapInit(),this.getDetail()]).then(res=>{
      this.drawTripLine(res[1]);
    })
    if(this.type=="wall"){
      this.getCommentsCount();
    }
    setTimeout(()=>{
      this.setMapHeight();
    },400)

  },
  deactivated () {

  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "carpool_rides"  || to.name == "carpool_requests") {
        to.meta.keepAlive = true;
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
