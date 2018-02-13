<template>
  <div class="page-view" :class="'cp-modal-add-'+type" id="Page-route-add">
    <div class="page-view-inner" >
      <!-- <title-bar  :left-options="{showBack: true}">{{type=="info"?"发布约车需求":"发布空座位"}}</title-bar> -->
      <cp-goback-btn></cp-goback-btn>
      <div class="page-view-main" >
        <div class="cp-map-wapper cp-map-wapper-addroute">
          <el-amap class="amap-box" :vid="'amap-vue'" :events="mapEvents" :plugin="mapPlugin">
            <el-amap-marker vid="marker-s" :position="marker_start.position"  v-if="marker_start.position.length > 1"></el-amap-marker>
            <el-amap-marker vid="marker-e" :position="marker_end.position"  v-if="marker_end.position.length > 1" ></el-amap-marker>
          </el-amap>
          <div class="amap-box" id="routeFormMap" style="height:100%">

          </div>
          <!-- <cp-map class="cp-map-content" id="map-add-content" style="width:100%; height:100%; min-height:500px;">地图加载中</cp-map> -->
          <div class="cp-map-form">
            <form   method="post" onsubmit="return false;">
              <div class="cp-userbar">
                <div class="cp-avatar-wrap">
                  <img class="cp-avatar " :src="avatar" :onerror="'this.src=\''+defaultAvatar+'\';return false'">
                </div>
                <div class="cp-userinfo"><span class="cp-username">{{userData.name}}</span> </div>
              </div>
              <div class="cp-map-form-inner">
                <div class="cp-route-wrapper" :class="{'exchanging':exChangeAddressing}">
                  <div class="cp-selectbtn-wrap cp-startp-wrap" :class="{'isNull':startIsNull}">
                    <div class="cp-selectbtn"  @click="selectAddress('start')" >
                      <span class="cp-label">
                        <i class="fa fa-map-marker"></i><span class="cp-title">起点</span>
                      </span>
                      <span class="cp-text">{{startName}}</span>
                    </div>
                  </div>
                  <div class="cp-btn-change" @click="exChangeAddress">
                    <svg class="icon" width="16" height="16" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M903.2 848 903.2 848l-144 160 0 0c-8.8 9.6-21.6 16-35.2 16-14.4 0-26.4-6.4-35.2-16l0 0-144-160 0 0c-8-8.8-12.8-20-12.8-32 0-26.4 21.6-48 48-48 14.4 0 26.4 6.4 35.2 16l0 0 60 67.2L675.2 624l0 0L675.2 416l0 0L675.2 172.8l0 0L675.2 48c0-26.4 21.6-48 48-48 26.4 0 48 21.6 48 48l0 304 0 112c0 0 0 0 0 0l0 96 0 291.2L832 784l0 0c8.8-9.6 21.6-16 35.2-16 26.4 0 48 21.6 48 48C916 828 911.2 839.2 903.2 848zM452 256c-14.4 0-26.4-6.4-35.2-16l0 0-60-67.2L356.8 464c0 0 0 0 0 0l0 96 0 112 0 304c0 26.4-21.6 48-48 48-26.4 0-48-21.6-48-48l0-124.8 0 0L260.8 608l0 0L260.8 400l0 0L260.8 172.8 200 240l0 0c-8.8 9.6-21.6 16-35.2 16-26.4 0-48-21.6-48-48 0-12 4.8-23.2 12.8-32l0 0L272 16l0 0c8.8-9.6 21.6-16 35.2-16 14.4 0 26.4 6.4 35.2 16l0 0 144 160 0 0c8 8.8 12.8 20 12.8 32C500 234.4 478.4 256 452 256z" /></svg>
                  </div>
                  <div class="cp-selectbtn-wrap cp-endp-wrap" :class="{'isNull':endIsNull}">
                    <div class="cp-selectbtn"  @click="selectAddress('end')">
                      <span class="cp-label">
                        <i class="fa fa-map-marker"></i><span class="cp-title">终点</span>
                      </span>

                      <span class="cp-text">{{endName}}</span>
                    </div>
                  </div>
                </div>
                <div class="cp-selectbtn-wrap cp-needTime-sWrap" id="J-needTime" v-if="type=='wall'">

                  <popup-picker class="cp-selectbtn"    v-model="formData.time" :data="timeDataArray" :display-format="formatDateDisplay"  >
                    <template slot="title" slot-scope="props">
                      <span class="cp-label">
                        <i class="fa fa-clock-o"></i><span class="cp-title" style="vertical-align:middle;">出发时间</span>
                      </span>
                    </template>
                  </popup-picker>
                </div>

                <div class="cp-selectbtn-wrap cp-seatCount-sWrap" id="J-pick-seatCount">
                  <div class="cp-selectbtn" >
                    <x-number :title="'<span class=\'cp-label\'><i class=\'fa fa-users\'></i><span class=\'cp-title\' style=\'vertical-align:middle;\'>空座位数</span></span>'"    v-model="formData.seat_count" button-style="round" :min="1" :max="10" fillable ></x-number>
                  </div>

                  <!--<popup-picker class=""     v-model="formData.seat_count" :data="[[1,2,3,4,5,6,7,8,9,10]]"  >
                    <template slot="title" slot-scope="props">
                      <span :class="props.labelClass" :style="props.labelStyle"  >
                        <i class="fa fa-car"></i>
                        <span style="vertical-align:middle;">空位数</span>
                      </span>
                    </template>
                  </popup-picker>-->
                </div>


                <x-button class="cp-btn cp-btn-submit" type="primary" :disabled="disableSubmitBtn" style="border-radius:99px;"><i class="cp-icon fa fa-paper-plane"></i>发布</x-button>


              </div>
            </form>
          </div>
        </div>
        <!-- /cp-map-wrap -->
      </div>
    </div>
  </div>
</template>

<script>

import config from '../configs'
import cFuns from '../utils/cFuns'
// import { AMapManager } from 'vue-amap';
import { lazyAMapApiLoaderInstance } from 'vue-amap';

export default {
  components: {

  },
  data () {
    return {
      type: this.$route.params.type,
      // AMapManager,
      formData:{
        time:[],
        seat_count:0,
        start:{pid:'',addressname:''},
        end  :{pid:'',addressname:''}
      },
      mapEvents:{
        init :(o)=>{
          this.mapObj = o;
          // console.log(this)
          // console.log(o.getCenter())
        },
      },
      mapObj:{},
      mapPlugin: [/*{
          pName: 'Geolocation',
          buttonPosition: 'RT',    //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(12, -100),
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.loaded = true;
                  self.$nextTick();
                }
              });
            }
          }
        },*/
        {
            pName: 'ToolBar',
            position:"LT",
            offset:new AMap.Pixel(-3, 110),
            autoPosition: true,
            // ruler:false,
            locate:true,
            events: {
              init(o) {
                console.log(o);
              }
            }
          }
      ],
      /*marker_start:{
        position:[112.861513, 22.885635]
      },*/
      disableSubmitBtn:true,

      time:[],
      formatDemoValue: "请输入时间",
      formatDateDisplay: function (value, name) {
        return name.split(" ")[0]+" "+`${value[1]}`+":"+`${value[2]}`
      },
      // avatar: config.defaultAvatar,
      defaultAvatar: config.defaultAvatar,

      exChangeAddressing : false,
    }
  },
  computed:{
    startName (){
      return this.formData.start.addressname ? this.formData.start.addressname : "请选择出发地"
    },
    endName (){
      return this.formData.end.addressname ? this.formData.end.addressname : "请选择目的地"
    },
    startIsNull (){
      return this.formData.start.addressname ? false : true;
    },
    endIsNull (){
      return this.formData.end.addressname ? false : true;
    },
    timeDataArray (){
      return cFuns.returnNeedTimeDatas(0,0)
    },
    marker_start (){
      let formData = this.formData
      let pos = formData.start.latitude && formData.start.longtitude ? [parseFloat(formData.start.longtitude),parseFloat(formData.start.latitude)] :[];
      return {position: pos}
    },
    marker_end (){
      let formData = this.formData
      let pos = formData.end.latitude && formData.end.longtitude ? [parseFloat(formData.end.longtitude),parseFloat(formData.end.latitude)] :[];
      return {position: pos}
    },
    userData (){
      let userData = this.$store.state.userData;
      return userData
    },
    avatar (){
      return this.$store.state.userAvatar;
    },


  },
  watch:{
    marker_start:function(val,oldval){

    },
    'formData.time':function(val,oldval){
      let formData = this.$store.state.routeFormData;
        formData.time = val;
        this.$store.commit('setRouteFormData',formData);
        // console.log(this.$store.state.routeFormData);
    },
    'formData.seat_count':function(val,oldval){
      let formData = this.$store.state.routeFormData;
        formData.seat_count = val;
        this.$store.commit('setRouteFormData',formData);
        // console.log(this.$store.state.routeFormData);
    },
  },
  methods: {

    //跳到地址业选地址
    selectAddress (to){
      this.$router.push({name:'carpool_address',params: {to:to}})
    },

    /**
     * [getDataFromStore 取得已存的数据]
     */
    getDataFormStore (){
      var _this = this;
      let formData_s = this.$store.state.routeFormData;
      console.log(formData_s)
      // console.log(this.$store.state.routeFormData)
      if(formData_s){
        _this.markerAndDraw(formData_s);

        if(formData_s.time){
          this.formData.time =  formData_s.time
        }
        if(formData_s.seat_count){
          this.formData.seat_count =  formData_s.seat_count
        }
      }
      // console.log(formData_s);
    },

    /**
     * [exChangeAddress 交换开始结束位置]
     */
    exChangeAddress (){
      let _this = this;
      if(this.startIsNull && this.endIsNull){
        return false;
      }
      this.exChangeAddressing = true;
      let formData_o = this.$store.state.routeFormData;
      // var formData_n =  this.$store.state.routeFormData;
      let startp = typeof(formData_o.start)!="undefined" && typeof(formData_o.start.latitude)!="undefined"  ? formData_o.start : {};
      let endp   = typeof(formData_o.end)!="undefined"  && typeof(formData_o.end.latitude)!="undefined" ? formData_o.end  : {};
      formData_o.end =  startp  ;
      formData_o.start = endp;
      this.formData =  Object.assign({}, formData_o);
      this.$store.commit('setRouteFormData',formData_o);
      // return false;
      // if(formData.start && formData.end ){ //画线
      //   _this.mapObj.clearMap()
      //   var start = new AMap.LngLat(parseFloat(formData.start.longtitude), parseFloat(formData.start.latitude));
      //   var end = new AMap.LngLat(parseFloat(formData.end.longtitude), parseFloat(formData.end.latitude));
      //
      //   cFuns.amap.drawRouteLine(start, end,_this.mapObj);
      // }
      _this.getDataFormStore();


      setTimeout(function(){_this.exChangeAddressing = false},500)
    },

    markerAndDraw (formData_s){
      var _this = this;
      if(formData_s.start && formData_s.start.latitude ){
        this.formData.start =  formData_s.start
        if(!this.formData.end.latitude){
          cFuns.amap.setCenter([parseFloat(formData_s.start.longtitude),parseFloat(formData_s.start.latitude)],this.mapObj);
        }
      }
      if(formData_s.end && formData_s.end.latitude){
        this.formData.end =  formData_s.end
        if(!this.formData.start.latitude){
          cFuns.amap.setCenter([parseFloat(formData_s.end.longtitude),parseFloat(formData_s.end.latitude)],this.mapObj);
        }
      }
      if(formData_s.start && formData_s.end && formData_s.start.latitude && formData_s.end.latitude){ //画线
        _this.mapObj.clearMap()
        var start = new AMap.LngLat(parseFloat(formData_s.start.longtitude), parseFloat(formData_s.start.latitude));
        var end = new AMap.LngLat(parseFloat(formData_s.end.longtitude), parseFloat(formData_s.end.latitude));

        cFuns.amap.drawRouteLine(start, end,this.mapObj);
      }
    }


  },
  mounted () {
    var _this = this;
    lazyAMapApiLoaderInstance.load().then(() => {
      // _this.mapObj = cFuns.amap.showMap("routeFormMap")

    });
  },
  created(){

  },
  activated (){
    // console.log(AMap);

    this.type = this.$route.params.type;

    this.getDataFormStore()
    if(typeof(this.formData.time[0])=="undefined"){
      let d = new Date();
      this.formData.time = [cFuns.formatDayItemData(d).value, cFuns.fixZero(d.getHours())+"",cFuns.fixZero(d.getMinutes())+""];
    }

    if(!this.formData.seat_count){
      this.formData.seat_count = 4;
    }
    // console.log(this.mapObj)
    // this.loadUserInfo()
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
