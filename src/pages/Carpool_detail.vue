<template>
  <div class="page-view " id="Page-trip-detail" >
    <!-- <title-bar  :left-options="{showBack: true}">详情</title-bar> -->
    <div class="page-view-main "   >
      <title-bar  v-show="isSticky">
        <div class="text-center" >{{user.name}}</div>
      </title-bar>
      <cp-goback-btn v-show="!isSticky" :class="{'cp-sticky':isSticky}"></cp-goback-btn>

      <cp-scroller :enableInfinite="false" :enableRefresh="false" id="cp-scroll-wrapper" @on-scroll="onScroll">
        <el-amap slot="before-inner" class="cp-map-content map-box" :vid="'amap-vue'" :events="mapEvents" :plugin="mapPlugin">  </el-amap>

        <div class="cp-main" >
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
                <tab-item class="cp-tab-item"  :key="0"><div class="cp-inner">详情</div></tab-item>
                <tab-item class="cp-tab-item"  :key="1" @on-item-click="getCommentLists"><div class="cp-inner">留言<b class="bage" v-show="comments_total>0">{{comments_total}}</b></div></tab-item>
                <tab-item class="cp-tab-item"  :key="2" @on-item-click="onShowPassengers" ><div class="cp-inner">乘客列表<b class="bage" v-show="detailData.took_count_all>0">{{detailData.took_count_all}}</b></div></tab-item>
              </tab>
            </div>

          </div>
          <div class="cp-content-item" :key="0" v-show="tabIndex == 0">

              <div class="alert " :class="alertClass" v-show="isShowAlert" ><span v-html="alertText"></span>
                <a v-show="isShowBtn_cancel_alert" @click="btnAction('cancel')" style='margin-left:4px' class='btn btn-sm btn-info'>取消</a>
                <a v-show="isShowBtn_finish_alert" @click="btnAction('finish')" style='margin-left:4px' class='btn btn-sm btn-info'>结束</a>
              </div>
              <div class="cp-cell cp-cell-time">
                  <div class="la"><i class="fa fa-clock-o"></i></div>
                  <span class="cp-time">{{detailData.time_format}}</span>
              </div>
              <cp-trip-box :start_name="detailData.start_info.addressname" :end_name="detailData.end_info.addressname"></cp-trip-box>
              <div class="cp-statis-list">
                <statis-item class="cp-statis-item col-xs-4 cp-time" title="出发时间" icon="fa fa-clock-o" :duration="1"><b slot="num"  class="num"><p class="date">{{detailData.time_format.split(' ')[0]}}</p>{{detailData.time_format.split(' ')[1]}}</b></statis-item>
                <statis-item class="cp-statis-item col-xs-4 cp-distance" title="预计路程" :num="statis.distance" :unit="statis.distance_unit" icon="fa fa-map-signs" :duration="1"></statis-item>
                <statis-item class="cp-statis-item col-xs-4" v-if="type=='wall'" title="剩余空位" :num="statis.surplus_count" icon="fa fa-car" :duration="1"></statis-item>
                <statis-item class="cp-statis-item col-xs-4 cp-status" v-if="type=='info'" title="状态"   :icon="statusIcon" ><b slot="num"  class="num">{{statusText}}</b></b></statis-item>
              </div>
              <div class="cp-btns-wrap">
                <a v-show="isShowBtn_phone"  class="cp-btn cp-btn-phone " :href="'tel:'+user.phone"><i class="cp-icon fa fa-phone"></i>电 话</a>
                <a v-show="isShowBtn_goback" class="cp-btn cp-btn-back "  @click="goBack"><i class="cp-icon fa fa-arrow-left"></i>返 回</a>
                <a v-show="isShowBtn_pickup" class="cp-btn cp-btn-pickup " @click="btnAction('pickup')"><i class="cp-icon fa fa-car"></i>接受请求</a>
                <a v-show="isShowBtn_riding" class="cp-btn cp-btn-riding " @click="btnAction('riding')"><i class="cp-icon fa fa-car"></i>搭 车</a>
                <a v-show="isShowBtn_cancel" class="cp-btn cp-btn-cancel "  @click="btnAction('cancel')"><i class="cp-icon fa fa-times"></i>取消行程</a>
                <a v-show="isShowBtn_complete" class="cp-btn cp-btn-ok "  @click="btnAction('finish')"><i class="cp-icon fa fa-check"></i>结束行程</a>
              </div>

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
                <li class="cp-commentLists-tips" ><router-link   :to="{ name:'carpool_rides_comments', params: {id: id} }">共{{comments_total}}条评论，查看全部</router-link></li>
              </ul>

            </template>

            <p class="cp-nodata-tips" v-else v-show="!isLoading_comments">还未有人评论   (´°̥̥̥̥̥̥̥̥ω°̥̥̥̥̥̥̥̥｀)</p>
            <div class="text-center"><router-link class="btn btn-default"  :to="{ name:'carpool_rides_comments', params: {id: id} }"><i class="fa fa-edit"></i> 我要评论</router-link></div>
          </div>
          <!-- /留言 -->

          <div class="cp-content-item" :key="2" v-show="tabIndex == 2">
            <div class="text-center"  v-show="isLoading_pss">
              <spinner type="dots" size="60px"></spinner>
            </div>
            <ul class="cp-wallView-passenger" v-if="passengers.length">
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
            <p class="cp-nodata-tips" v-else v-show="!isLoading_pss">未有乘客</p>
          </div>
          <!-- /乘客 -->

          <!-- /tab -->


        </div>
      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from '../configs/index'
import cFuns from '../utils/cFuns'
import {Tab, TabItem} from 'vux'


import CpAvatar from '../components/CpAvatar'
import CpTripBox from '../components/CpTripBox'

import StatisItem from '../components/StatisItem'


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
      isShowBtn_complete :false,
      isShowBtn_cancel_alert:false,
      isShowBtn_finish_alert: false,

      //statis-item组件相关
      statis            :{
        surplus_count:0,
        distance:0
      },
      statusText        :"-",
      statusIcon        :"fa fa-car",

      //地图相关
      mapObj            :{},
      mapEvents:{
        init :(o)=>{
          let _this = this;
          this.mapObj = o;
          // this.getDetail()
          if(!this.$store.state.localCity){
            this.mapObj.getCity(function(data) {
                if (data['province'] && typeof data['province'] === 'string') {
                  _this.$store.commit('setLocalCity',data);
                  _this.city = data.city
                }
            });
          }
        },
      },
      mapPlugin: [
        {
            pName: 'ToolBar',
            position:"LT",
            offset:new AMap.Pixel(-3, 70),
            autoPosition: true,
            // ruler:false,
            locate:false,
            events: {
              init(o) {}
            }
          }
      ],

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
    init (){

    },
    goBack () {
        this.$router ? this.$router.back() : window.history.back();
    },
    changeStatus(status){
      console.log(this.type);
      let _this = this;
      _this.isShowBtn_phone   = false;
      _this.isShowBtn_goback  = false;
      _this.isShowBtn_pickup  = false;
      _this.isShowBtn_riding  = false;
      _this.isShowBtn_cancel  = false;
      _this.isShowBtn_complete= false;
      _this.isShowBtn_cancel_alert = false;
      _this.isShowBtn_finish_alert = false;

      _this.isShowBtn_phone = _this.uid == _this.user.uid ? false : true;
      _this.isShowAlert = _this.type=="info" ? true : false
      // console.log(_this.type);
      switch (parseInt(status)) {
        case 0:
            _this.alertText = "该乘客正等待被搭载"
            _this.isShowBtn_cancel = _this.uid == _this.user.uid ? true : false;
            if(_this.type=="wall"){
              _this.isShowBtn_complete = _this.uid == _this.user.uid ? true : false;
              if(_this.detailData.hasTake > 0){
                  _this.isShowAlert = true;
                  _this.alertClass  = "alert-info"
                  _this.alertText = "你已搭该司机的车";
                  _this.isShowBtn_cancel_alert = true;
                  _this.isShowBtn_finish_alert = true;
                  _this.isShowBtn_goback =  true;
              }else if(_this.detailData.hasTake_finish > 0){
                _this.isShowBtn_goback = true;
              }else{
                _this.isShowBtn_riding = _this.uid == _this.user.uid ? false : true;
              }
            }
            if(_this.type=="info"){
              _this.isShowBtn_pickup = _this.uid == _this.user.uid ? false : true;
            }
            _this.statusText  = "等车中";
            _this.statusIcon  = "fa fa-user";
          break;
        case 1:
            if(_this.type=="wall"){
              _this.isShowBtn_cancel = _this.uid == _this.user.uid ? true : false;
              _this.isShowBtn_complete = _this.uid == _this.user.uid ? true : false;
              if(_this.detailData.hasTake > 0){
                  _this.isShowAlert = true;
                  _this.alertClass  = "alert-info"
                  _this.alertText = "你已搭该司机的车";
                  _this.isShowBtn_cancel_alert = true;
                  _this.isShowBtn_finish_alert = true;
                  _this.isShowBtn_goback =  true;
              }else if(_this.detailData.hasTake_finish > 0){
                _this.isShowBtn_goback = true;
              }else{
                _this.isShowBtn_riding = _this.uid == _this.user.uid ? false : true;
              }


            }
            if(_this.type=="info"){
              _this.alertText = "该乘客已被司机 【<img class='cp-avatar' src='"+_this.detailData.owner_info.avatar+"' /> "+_this.detailData.owner_info.name+" 】搭载";
              _this.isShowBtn_cancel = _this.uid == _this.user.uid || _this.detailData.owner_info.uid == _this.uid ? true : false;
              _this.isShowBtn_complete = _this.uid == _this.user.uid || _this.detailData.owner_info.uid == _this.uid ? true : false;
            }

            _this.statusText  = "已搭车";
            _this.statusIcon  = "fa fa-car";
          break;
        case 2:
            _this.alertText = "行程已取消"
            _this.isShowBtn_goback =  true;
            _this.statusText  = "已取消";
            _this.statusIcon  = "fa fa-times";

          break;
        case 3:
            _this.alertText = "行程已完成"
            _this.isShowBtn_goback = true;
            _this.statusText  = "已完成";
            _this.statusIcon  = "fa fa-check";
          break;
        default:
      }

    },
    /**
     * 取得明细
     */
    getDetail (){
      var _this = this;
      let url = this.type == "wall" ? config.urls.getRideDetail : config.urls.getRequestDetail;
      this.$tokenAxios.get(url,{params:{id:_this.id}}).then(res => {
        // console.log(res);
        if(res.data.code === 0) {
          let data = res.data.data;
          _this.detailData      = data;
          _this.uid             = data.uid;
          _this.detailData.owner_info.avatar = data.owner_info.imgpath ? config.avatarBasePath + data.owner_info.imgpath : _this.defaultAvatar;
          if( _this.type == "info"){
            _this.typeLabel           = "乘客"
            _this.passengers[0]       = data.passenger_info;
            _this.passengers[0].avatar = data.passenger_info.imgpath ? config.avatarBasePath + _this.passengers[0].imgpath :_this.defaultAvatar ;
            _this.isShowAlert          = true;
            _this.user                 = data.passenger_info

          }else{
            _this.typeLabel            = data.owner_info.carnumber;
            _this.user                 = data.owner_info;
            _this.statis.seat_count    = data.seat_count;
            _this.statis.took_count    = data.took_count;
            _this.statis.surplus_count = data.seat_count - data.took_count;

          }
          this.changeStatus(data.status)
          // _this.status = data.status;
          _this.mapObj.clearMap()

          let start = [data.start_info.longtitude,data.start_info.latitude]
          let end = [data.end_info.longtitude,data.end_info.latitude]
          setTimeout(function(){
            cFuns.amap.drawTripLine(start, end,_this.mapObj,function(status,result){
              if(status == 'complete'){
                _this.isShowComputebox = true;
                var distance = result.routes[0].distance; //计出的距离
                var distanceObj = cFuns.amap.formatDistance(distance,1);
                // var distanceStr = distanceObj.distance + distanceObj.unit;
                var dtTime = result.routes[0].time;
                var dtTimeStr = cFuns.amap.formatTripTime(dtTime);

                _this.statis.distance = parseFloat(distanceObj.distance);
                _this.statis.distance_unit = distanceObj.unit;
              }else{
                _this.statis.distance = 0;
              }
            });
          },1000)

        }else{

        }
      })
      .catch(error => {
        console.log(error)
      })
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
      let _this = this;
      let params = {wallid:this.id}
      _this.$tokenAxios.get(config.urls.getRidePassengers,{params:params}).then(res => {

        let data = res.data.data;
        _this.isLoading_pss = false;
        if(res.data.code === 0) {
          data.lists.forEach(function(value,index,arr){
            value.avatar = value.imgpath ? config.avatarBasePath + value.imgpath : _this.defaultAvatar;
          })
          _this.passengers = data.lists;
          _this.took_count = _this.passengers.length;
          _this.passengers_time = new Date().getTime();
        }else{

        }
      })
      .catch(error => {
        console.log(error)
        _this.isLoading_pss = false;

      })
    },

    /**
      * 取得评论总数
      */
     getCommentsCount (){
       var _this = this;
       let params = {wid:this.id,getcount:1}
       _this.$tokenAxios.get(config.urls.wallComments,{params:params}).then(res => {
         if(res.data.code == 0){
           var data = res.data.data;
           _this.comments_total = data.total;
           // console.log(_this.comments_total)
         }
       });
     },

     /**
     * 取得评论列表数据
     */
     getCommentLists (){
       var _this = this;
       var nowTimestamp = new Date().getTime();
       if(this.comments.length > 5  || nowTimestamp - _this.comments_time < 60*1000){
         return false;
       }
       this.isLoading_comments = true;

       let params = {wid:_this.id,num:5}
       _this.$tokenAxios.get(config.urls.wallComments,{params:params}).then(res => {
         // console.log(res);
         _this.isLoading_comments = false;
         if(res.data.code == 0){
           var data = res.data.data;
           data.lists.forEach(function(value,index,arr){
             value.avatar = value.imgpath ? config.avatarBasePath + value.imgpath : _this.defaultAvatar;
           })
           _this.comments_total = data.total ? data.total : 0;
           _this.comments = data.lists;
           _this.comments_time = nowTimestamp;
         }
       }).catch(error => {
         _this.isLoading_comments = false;
         console.log(error)
       });
     },
     /******* 按钮相关方法 *******/
     /**
      * [btnAction]
      */
     btnAction (action){
       var _this = this;
       var url,postData,confirmText;
       var successText = "成功"
       var confirmTitle = "请确认"
       var isJumpToMytrip = false;
       switch (action) {
         case 'pickup':
           url = config.urls.acceptRequest;
           postData = {id:_this.id};
           confirmText = '是否接受【'+_this.user.name+'】的约车'
           successText = "搭载成功"
           isJumpToMytrip = true;
           break;
         case 'riding':
           url = config.urls.riding;
           postData = {wid:_this.id};
           confirmText = '是否要坐【'+_this.user.name+'】的车'
           successText = "搭车成功"
           isJumpToMytrip = true;
           break;
         case 'finish':
           url = config.urls.finishTrip;
           postData = {id:_this.id,from:_this.type};
           confirmText = '是否结束本次行程'
           successText = "本次行程已完成"
           isJumpToMytrip = false;
           var success = function(rs){
             if( _this.uid == _this.user.uid){
               _this.detailData.status = 3;
               _this.changeStatus(3);
             }else{
               _this.statis.took_count      = _this.statis.took_count - 1;
               _this.detailData.took_count  = _this.detailData.took_count - 1;
               _this.detailData.hasTake = 0;
               // _this.passengers  = _this.passengers.filter(t => t.uid != _this.uid);
               _this.passengers_time = 0;
               _this.isShowBtn_finish_alert = false;

               _this.changeStatus(_this.detailData.status);
             }
           }
           break;
         case 'cancel':
           url = config.urls.cancelTrip;
           postData = {id:_this.id,from:_this.type};
           confirmText = '您确定要取消本次行程吗？'
           successText = "取消成功"
           isJumpToMytrip = false;
           var success = function(rs){
             if( _this.uid == _this.user.uid){
               _this.detailData.status = 2;
               _this.changeStatus(2);
             }else{
               _this.statis.took_count          = _this.statis.took_count - 1;
               _this.detailData.took_count      = _this.detailData.took_count - 1;
               _this.detailData.took_count_all  = _this.detailData.took_count_all - 1;
               _this.detailData.hasTake = 0;
               // _this.passengers  = _this.passengers.filter(t => t.uid != _this.uid);
               _this.passengers_time = 0;
               _this.isShowBtn_cancel_alert = false;

               _this.changeStatus(_this.detailData.status);
             }
           }
           break;
       }
       // event.stopPropagation();
       this.$vux.confirm.show({
         title  : confirmTitle,
         content: confirmText,
         onConfirm () {
           _this.$store.commit('setLoading',{isShow:true,text:"提交中"});
           // return false;
           _this.$tokenAxios.post(url,postData).then(res => {
             _this.$store.commit('setLoading',{isShow:false});
             if(res.data.code === 0) {
               _this.$vux.toast.text(successText);
               if(typeof(success)==="function"){
                 success(res.data);
               }
               if(isJumpToMytrip){
                 _this.$store.commit('setJumpTo',{name:"carpool_mytrip"});
                 _this.$router.push({name:'carpool'});
               }

             }else{
               _this.$vux.toast.text(res.data.desc,'middle');
             }
           })
           .catch(error => {
             _this.$store.commit('setLoading',{isShow:false});
             _this.$vux.toast.text('网络好像不太畅通');
             console.log(error)
           })
         }
       })
     },

     onScroll(e){
       let sTop = e.target.scrollTop;
       if(sTop > 280){
         this.isSticky = true;
       }else{
         this.isSticky = false;
       }
     }




  },

  created () {


  },
  mounted () {

  },
  activated (){
    // console.log(this.type)

    let path = this.$route.path;
    this.tabIndex   = 0;
    this.isSticky   = false;
    this.passengers = [];
    this.passengers_time = 0 ;
    this.comments          = [];
    this.comments_time     = 0;
    this.comments_total    = 0;
    if(path.indexOf('requests')>1){
      this.type =  'info';
    }
    if(path.indexOf('rides')>1){
      this.type =  'wall';
    }

    //
    this.id = this.$route.params.id;
    this.getDetail()
    if(this.type=="wall"){
      this.getCommentsCount();
    }
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
