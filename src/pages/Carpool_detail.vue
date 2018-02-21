<template>
  <div class="page-view " id="Page-route-detail" >
    <!-- <title-bar  :left-options="{showBack: true}">详情</title-bar> -->
    <div class="page-view-main "   >
      <cp-goback-btn></cp-goback-btn>

      <cp-scroller :enableInfinite="false" :enableRefresh="false">
        <el-amap slot="before-inner" class="cp-map-content map-box" :vid="'amap-vue'" :events="mapEvents" :plugin="mapPlugin">  </el-amap>

        <div class="cp-content">
          <div class="cp-heading " >
              <img class="cp-avatar " :src="user.avatar" :onerror="'this.src=\''+defaultAvatar+'\';return false'">
              <div class="cp-txt">
                <h3>{{user.name}}</h3>
              </div>
              <h6>{{typeLabel}}</h6>
              <h4 class="department">{{user.Department}}</h4>
          </div>
          <div class="cp-heading-bg"></div>
          <!-- / heading -->


          <tab class="cp-tab-wrapper" :line-width="2" active-color='#8877ba' v-model="tabIndex">
            <tab-item class="cp-tab-item"  :key="0"><div class="cp-inner">详情</div></tab-item>
            <tab-item class="cp-tab-item"  :key="1"><div class="cp-inner">留言</div></tab-item>
            <tab-item class="cp-tab-item"  :key="2" @on-item-click="onShowPassengers" ><div class="cp-inner">乘客列表<b class="bage" v-show="statis.took_count>0">{{statis.took_count}}</b></div></tab-item>

          </tab>

            <div class="cp-content-item" :key="0" v-show="tabIndex == 0">

                <div class="alert alert-info" v-show="isShowAlert" v-html="alertText">  </div>
                <div class="cp-cell cp-cell-time">
                    <div class="la"><i class="fa fa-clock-o"></i></div>
                    <span class="cp-time">{{time}}</span>
                </div>
                <cp-route-box :start_name="start.addressname" :end_name="end.addressname"></cp-route-box>
                <div class="cp-statis-list">
                  <statis-item class="cp-statis-item col-xs-4 cp-time" title="出发时间" icon="fa fa-clock-o" :duration="1"><b slot="num"  class="num"><p class="date">{{time.split(' ')[0]}}</p>{{time.split(' ')[1]}}</b></statis-item>
                  <statis-item class="cp-statis-item col-xs-4 cp-distance" title="预计路程" :num="statis.distance" :unit="statis.distance_unit" icon="fa fa-map-signs" :duration="1"></statis-item>
                  <statis-item class="cp-statis-item col-xs-4" v-if="type=='wall'" title="剩余空位" :num="statis.surplus_count" icon="fa fa-car" :duration="1"></statis-item>
                  <statis-item class="cp-statis-item col-xs-4 cp-status" v-if="type=='info'" title="状态"   :icon="statusIcon" ><b slot="num"  class="num">{{statusText}}</b></b></statis-item>
                </div>
                <div class="cp-btns-wrap">
                  <a v-show="isShowBtn_phone"  class="cp-btn cp-btn-phone " :href="'tel:'+user.phone"><i class="cp-icon fa fa-phone"></i>电 话</a>
                  <a v-show="isShowBtn_goback" class="cp-btn cp-btn-back " onclick="cGoBack()"><i class="cp-icon fa fa-arrow-left"></i>返 回</a>
                  <a v-show="isShowBtn_pickup" class="cp-btn cp-btn-pickup " onclick="pageMethods.acceptDemand('+data.infoid+',this)"><i class="cp-icon fa fa-car"></i>接受请求</a>
                  <a v-show="isShowBtn_riding" class="cp-btn cp-btn-riding " onclick="pageMethods.acceptDemand('+data.infoid+',this)"><i class="cp-icon fa fa-car"></i>搭 车</a>
                  <a v-show="isShowBtn_cancel" class="cp-btn cp-btn-cancel "  onclick="pageMethods.cencelRoute('+data.infoid+',\'info\',this)"><i class="cp-icon fa fa-times"></i>取消行程</a>
                  <a v-show="isShowBtn_complete" class="cp-btn cp-btn-ok "  onclick="pageMethods.finishRoute('+data.infoid+',\'info\',this)"><i class="cp-icon fa fa-check"></i>结束行程</a>
                </div>

            </div>
            <!-- /详情 -->
            <div class="cp-content-item" :key="1" v-show="tabIndex == 1">
              1
            </div>
            <!-- /乘客 -->
            <div class="cp-content-item" :key="2" v-show="tabIndex == 2">
              <div class="text-center"  v-show="isLoading_pss">
                <spinner type="dots" size="60px"></spinner>
              </div>
              <ul class="cp-wallView-passenger">
                <li class="cp-item " v-for="(item,index) in passengers ">
                  <img class="cp-avatar pull-left img-circle img-responsive " :src="user.avatar" :onerror="'this.src=\''+defaultAvatar+'\';return false'">
                  <div class="cp-txt">
                    <h4 class="media-heading">{{item.name}}</h4>
                    <p>{{item.Department}}</p>
                  </div>
                  <div class="cp-btns-wrap">
                    <a :href="'tel:'+item.phone" class="btn  btn-fab btn-fab-mini"><i class="fa fa-phone"></i></a>
                  </div>
               </li>

              </ul>

            </div>
            <!-- /留言 -->

          <!-- /tab -->


        </div>
      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from '../configs/index'
import cFuns from '../utils/cFuns'

import CpRouteBox from '../components/CpRouteBox'
import CpScroller from '../components/CpScroller'
import StatisItem from '../components/StatisItem'


export default {
  components: {
    CpRouteBox,CpScroller,StatisItem
  },
  data () {
    return {

      id                : this.$route.params.id,
      start             :{addressname:'-'},
      end               :{addressname:'-'},
      time              :"0000-00-00 00:00",
      tabIndex          : 0,
      isShowAlert       :false,
      alertText         :"",

      //用户相关
      carowner          :{},
      passengers        :[],
      isLoading_pss     :true,
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
    type (){
      let path = this.$route.path;
      if(path.indexOf('requests')>1){
        return 'info';
      }
      if(path.indexOf('rides')>1){
        return 'wall';
      }

    }
  },
  methods :{
    init (){

    },
    /**
     * 取得明细
     */
    getDetail (){
      var _this = this;
      let url = this.type == "wall" ? config.urls.getRideDetail : config.urls.getRequestDetail;
      this.$tokenAxios.get(url,{params:{id:_this.id}}).then(res => {
        console.log(res);
        if(res.status!==200){
          _this.$vux.toast.text('网络不畅，请稍候再试');
          return false;
        }
        if(!cFuns.checkLoginByCode(res.data.code,_this,1)){return false;}
        if(res.data.code === 0) {
          let data = res.data.data;
          _this.time = data.time_format;
          _this.start = data.start_info;
          _this.end = data.end_info;
          _this.carowner = data.owner_info;
          _this.carowner.avatar = data.owner_info.imgpath ? config.avatarBasePath + _this.carowner.imgpath : _this.defaultAvatar;
          if( _this.type == "info"){
            _this.typeLabel = "乘客"
            _this.passengers[0] = data.passenger_info;
            _this.passengers[0].avatar = data.passenger_info.imgpath ? config.avatarBasePath + _this.passengers[0].imgpath :_this.defaultAvatar ;
            _this.isShowAlert = true;
            _this.user = data.passenger_info
            _this.isShowBtn_phone = data.uid == _this.user.uid ? false : true;
            switch (parseInt(data.status)) {
              case 0:
                  _this.alertText = "该乘客正等待被搭载"
                  _this.isShowBtn_cancel = data.uid == _this.user.uid ? true : false;
                  _this.isShowBtn_pickup = data.uid == _this.user.uid ? false : true;
                  _this.statusText  = "等车中";
                  _this.statusIcon  = "fa fa-user";
                break;
              case 1:
                  _this.alertText = "该乘客已被司机 【<img class='cp-avatar' src='"+_this.carowner.avatar+"' /> "+_this.carowner.name+" 】搭载";
                  _this.isShowBtn_cancel = data.uid == _this.user.uid ? true : false;
                  _this.isShowBtn_complete = data.uid == _this.user.uid ? true : false;
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

          }else{
            _this.typeLabel = _this.carowner.carnumber

            _this.user =   _this.carowner
            _this.statis.seat_count = data.seat_count
            _this.statis.took_count = data.took_count
            _this.statis.surplus_count = data.seat_count - data.took_count
            _this.isShowBtn_phone = data.uid == _this.user.uid ? false : true;
            switch (parseInt(data.status)) {
              case 0:
                  _this.isShowBtn_cancel = data.uid == _this.user.uid ? true : false;
                  _this.isShowBtn_riding = data.uid == _this.user.uid ? false : true;

                break;
              case 1:
                  _this.alertText = "该乘客已被司机 【<img class='cp-avatar' src='"+_this.carowner.avatar+"' /> "+_this.carowner.name+" 】搭载";
                  _this.isShowBtn_cancel = data.uid == _this.user.uid ? true : false;
                  _this.isShowBtn_complete = data.uid == _this.user.uid ? true : false;
                break;
              case 2:
                  _this.alertText = "行程已取消"
                  _this.isShowBtn_goback =  true;
                break;
              case 3:
                  _this.alertText = "行程已完成"
                  _this.isShowBtn_goback =  true;
                break;
              default:

            }

          }


          let start = [_this.start.longtitude,_this.start.latitude]
          let end = [_this.end.longtitude,_this.end.latitude]

          setTimeout(function(){
            cFuns.amap.drawRouteLine(start, end,_this.mapObj,function(status,result){
              if(status == 'complete'){
                _this.isShowComputebox = true;
                var distance = result.routes[0].distance; //计出的距离
                var distanceObj = cFuns.amap.formatDistance(distance,1);

                // var distanceStr = distanceObj.distance + distanceObj.unit;
                var dtTime = result.routes[0].time;
                var dtTimeStr = cFuns.amap.formatRouteTime(dtTime);

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
    onShowPassengers (){
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
        if(res.status!==200){
          _this.$vux.toast.text('网络不畅，请稍候再试');
          return false;
        }
        if(!cFuns.checkLoginByCode(res.data.code,_this,1)){return false;}
        let data = res.data.data;
        _this.isLoading_pss = false;
        if(res.data.code === 0) {
          data.lists.forEach(function(value,index,arr){
            value.avatar = value.imgpath ? config.avatarBasePath + value.imgpath : _this.defaultAvatar;
          })
          _this.passengers = data.lists
          console.log(_this.passengers)
        }else{

        }
      })
      .catch(error => {
        console.log(error)
      })

    },

  },
  mounted () {

  },
  created () {
    console.log(this.type)
    this.getDetail()
    // this.$nextTick(function () {
    //  this.$refs['j-herblist-scrollBox'].addEventListener('scroll', this.listScroll); //监听滚动加载更多
    // })
  },
  activated (){
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  #Page-route-detail {
    .cp-scroll {top:0;
      section.cp-scroll-inner { top:0}
    }
  }
</style>
