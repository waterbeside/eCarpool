<template>
  <div class="page-view"  id="Page-address-add">
    <div class="page-view-inner" >
      <!-- <title-bar  :left-options="{showBack: true}">{{type=="info"?"发布约车需求":"发布空座位"}}</title-bar> -->
      <cp-goback-btn></cp-goback-btn>
      <div class="page-view-main" >
        <div class="cp-map-wapper  cp-map-wapper-addroute">
          <el-amap class="amap-box" :vid="'amap-vue-address'" :events="mapEvents" :plugin="mapPlugin">
            <el-amap-marker vid="marker-my" :position="myMarker.position"  v-if="myMarker.position.length > 1" :events="myMarker.events"></el-amap-marker>

            <el-amap-marker  v-for="(marker, index) in markers" :position="marker.position" :events="marker.events"  :vid="index"></el-amap-marker>
            <el-amap-info-window  v-if="markerInfoWin.position.length > 1" class="cp-markInfo-box-wrapper"
              :autoMove="true"

              :position="markerInfoWin.position"
              :visible="markerInfoWin.visible"
              :offset="infoWin_offset"
              :events="markerInfoWin.events"
              >
              <div class="cp-markInfo-box">
                <div class="form-horizontal">
                  <form @submit.prevent="searchMap(0)">
                    <div class="cp-form-group ">
                      <label  class="control-label"  for="addressname"><i class="fa fa-map-marker"></i>站点名称</label>
                      <input class="form-control form-control-line" type="text" name="keyword"  ref="keywordBox"  v-model="keyword" v-focus="isFocusKeyword"/>
                      <span class="cp-search-btn" @click="searchMap(0)"><i class="fa fa-search"></i></span>
                    </div>
                  </form>
                  <div class="">
                    {{infoWin_addressname}}
                  </div>
                  <div class="">
                    {{infoWin_address}}
                  </div>
                  <x-button type="primary" class=" btn-submit" @click.native="doSubmit" :disabled="isSubmiting">确 定</x-button>
                </div>
              </div>

            </el-amap-info-window>

          </el-amap>


        </div>
        <!-- /cp-map-wrap -->
      </div>
    </div>
  </div>
</template>

<script>

import config from '../configs'
import cFuns from '../utils/cFuns'
import cModel from '../utils/cModel'

// import { AMapManager } from 'vue-amap';
// import { lazyAMapApiLoaderInstance } from 'vue-amap';

export default {
  components: {

  },
  data () {
    return {
      to: this.$route.params.to,
      keyword : this.$route.params.keyword,
      keyword_o : '',
      isFocusKeyword : true,
      pointData:{},
      infoWin_addressname:'',
      infoWin_address:'',
      infoWin_offset:[3,-25],
      city:'', //当前城市
      mapEvents:{ //地图事件。
        init :(o)=>{
          let _this =this;
          this.mapObj = o;
          if(!this.$store.state.localCity){
            this.mapObj.getCity(function(data) {
                if (data['province'] && typeof data['province'] === 'string') {
                  _this.$store.commit('setLocalCity',data);
                  _this.city = data.city
                  console.log(_this.city);
                  _this.searchMap(1)
                }
            });
          }else{
            _this.city = this.$store.state.localCity;
            _this.searchMap(1)
          }
          // console.log(this)
          // console.log(o.getCenter())
        },
        'click': (e) => {
          console.log(e)
          let position = [e.lnglat.lng,e.lnglat.lat];
          let _this = this;
          _this.myMarker.position = position;
          _this.myMarker.events = {
            'click': (e) => {
              _this.doClickMyMarker(position);
            },
          }
          _this.doClickMyMarker(position);

        }
      },
      mapObj:{}, //存放地图实例对象
      mapPlugin: [ //地图插件
        {
            pName: 'ToolBar',
            position:"LT",
            offset:new AMap.Pixel(-3, 80),
            autoPosition: true,
            // ruler:false,
            locate:false,
            events: {
              init(o) {
                console.log(o);
              },

            }
          }
      ],
      markers:[], //标记点列表
      myMarker:{  position:[] }, //点击地图空白位置的标记点
      markerInfoWin:{position:[]},//地图窗体
      isSubmiting:false,

    }
  },
  computed:{

  },
  watch:{

  },
  directives: {
    focus: {
        inserted: function (el, {value}) {
            if (value) {
                el.focus();
            }
        }
    }
  },
  methods: {
    /**
     * 显示地图窗体
     * @param  {array} position [坐标]
     */
    showMarkerInfoWin (position){
      let _this = this;
      let infoWin_Setting = {
        position:position,
        visible:true,
      }
      _this.markerInfoWin = Object.assign({},infoWin_Setting);
    },
    /**
     * 取得坐标的地址信息
     * @param  {array} lnglat  [坐标]
     * @param  {function} callback [回调函数]
     */
    getMarkerInfo (lnglat,callback){
      let _this = this;
      var geocoder = this.geocoder;
      // var marker = pageDatas.marker;
      AMap.plugin('AMap.Geocoder',function(){
          var geocoder = new AMap.Geocoder({
              city:_this.city//城市，默认：“全国”
          });
          _this.geocoder = geocoder;
          // marker.setPosition(lnglat);
          geocoder.getAddress(lnglat,function(status,result){
            // console.log(result);
            console.log(result);
            if(typeof(callback)=="function"){
              callback(status,result);
            }
            if(status=='complete'){
              return result;
            }else{
              return false;
               // message.innerHTML = '无法获取地址'
            }
          })
      });
    },
    /**
     * 点击myMarker时弹出信息窗体
     * @param {array} lnglat [坐标]
     */
    doClickMyMarker (lnglat){
      let _this = this;
      _this.getMarkerInfo(lnglat,function(status,result){
        _this.infoWin_address = status=='complete' ?  result.regeocode.formattedAddress : "...";
        _this.infoWin_addressname =  "";
        _this.pointData = {
          longtitude:lnglat[0],
          latitude:lnglat[1],
          address:_this.infoWin_address,
          city:result.regeocode.addressComponent.city
        }
        _this.showMarkerInfoWin(lnglat);
      })
    },
    /**
     * 执行提交
     */
    doSubmit (){
      let _this = this;
      let pointData = this.pointData;

      let postDatas = {
        longtitude:pointData.longtitude,
        latitude:pointData.latitude,
        addressname: _this.keyword,
        address:pointData.address,
        to:_this.to,
        city:pointData.city
      }
      this.isSubmiting = true;

      this.$tokenAxios.post(config.urls.createAddress,postDatas).then(res => {
        this.isSubmiting = false;
        if(res.status!==200){
          this.$vux.toast.text('网络不畅，请稍候再试');
          return false;
        }
        var resData = res.data.data
        if(!cFuns.checkLoginByCode(res.data.code,_this,1)){return false;}
        if(res.data.code === 0){
          var inDatas = {
            addressid:resData.aid,
            listorder:3,
            addressname: postDatas.addressname,
            latitude: postDatas.latitude,
            longtitude: postDatas.longtitude,
            address:postDatas.address,
            is_show:true,
            address_type:'new'
          };
          // pageMethods.addAddressToDB(inDatas);
          cModel.myAddress('add',{data:inDatas,success:function(result){console.log(result)}});
          if(_this.to == 'start' || _this.to == 'end' ){
            let formData = this.$store.state.routeFormData;

            formData[_this.to] =   inDatas;

            // console.log(formData);
            this.$store.commit('setRouteFormData',formData);
            console.log(formData);
            this.$router.go(-2);


          }else if( pageDatas.from == 'home' || pageDatas.from == 'company' ){

          }
        }
      })


    },

    /**
     * 通过关键词添加标注点
     * @param  {Boolean} autoShow [是否自动弹出地图窗体]
     */
    searchMap (autoShow){
      var _this = this;
      this.city = _this.$store.state.localCity.city;
      autoShow = autoShow  || 0;
      AMap.service('AMap.PlaceSearch',function(){//回调函数
       //实例化PlaceSearch
       var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
            pageSize: 15,
            pageIndex: 1,
            city: _this.city//城市
        });
        if(_this.keyword_o == _this.keyword || _this.keyword == ''){
          return false;
        }

        _this.keyword_o = _this.keyword;
        console.log(_this.keyword)
        //关键字查询
        placeSearch.search(_this.keyword, function(status, result) {
          if( typeof(result.poiList)!='undefined' && result.poiList.pois.length>0){

            result.poiList.pois.forEach(function(value,index,arr){
              value.position = [value.location.lng, value.location.lat]
              value.events= {
                click: (e) => {
                 _this.setPointData(value)
                 // console.log(value)
                },
              }
              if(index===0 && autoShow){
                cFuns.amap.setCenter(value.position,_this.mapObj,12);
                _this.setPointData(value)

              }
             // value.visible =  true;
             // _this.markers.push(value);
            })

            _this.markers = result.poiList.pois;
            // console.log(_this.markers);

          }else{
            if(autoShow){ //自动中央标注点信息

              let center = _this.mapObj.getCenter()
              let position = [center.lng,center.lat]
              _this.myMarker.position = position;
              _this.getMarkerInfo(position,function(status,result){
                _this.infoWin_address = status=='complete' ?  result.regeocode.formattedAddress : "...";
                _this.infoWin_addressname =  "";
                _this.showMarkerInfoWin(position);
              })
            }
          }

        });
       })
       return false;
    },

    setPointData (datas){
      let _this = this;
      _this.pointData = {
        longtitude:datas.position[0],
        latitude:datas.position[1],
        address:datas.address,
        city:_this.city
      }
      _this.infoWin_address = datas.address;
      _this.infoWin_addressname = datas.name;
      _this.showMarkerInfoWin(datas.position);
    }

  },
  mounted () {
    var _this = this;
    /*lazyAMapApiLoaderInstance.load().then(() => {
      // _this.mapObj = cFuns.amap.showMap("routeFormMap")

    });*/
  },
  created(){
    var _this = this;
    // console.log(AMap);
    this.to = this.$route.params.to;
    this.keyword = this.$route.params.keyword;
    // _this.searchMap(1);
  },
  activated (){

  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
