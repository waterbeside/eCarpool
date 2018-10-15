<template>
  <div class="page-view"  id="Page-address-add">
    <div class="page-view-inner" >
      <!-- <title-bar  :left-options="{showBack: true}">{{type=="info"?"发布约车需求":"发布空座位"}}</title-bar> -->
      <cp-goback-btn></cp-goback-btn>
      <div class="page-view-main" >
        <div class="cp-map-wapper  cp-map-wapper-addtrip">
          <el-amap class="amap-box" :vid="'amap-vue-address'" :events="mapEvents" :plugin="mapPlugin">
            <el-amap-marker vid="marker-my" :position="myMarker.position"  v-if="myMarker.position.length > 1" :events="myMarker.events"></el-amap-marker>

            <el-amap-marker  v-for="(marker, index) in markers" :position="marker.position" :events="marker.events"  :vid="index" :key="marker.index"></el-amap-marker>
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
                      <label  class="control-label"  for="addressname"><i class="fa fa-map-marker"></i>{{$t("message['address.stationName']")}}</label>
                      <input class="form-control form-control-line" type="text" name="keyword"  ref="keywordBox"  v-model="keyword"   v-focus="isFocusKeyword" @focus="isFocusKeyword=true" @blur="isFocusKeyword=false"/>
                      <span class="cp-search-btn" @click="searchMap(0)"><i class="fa fa-search"></i></span>
                    </div>
                  </form>
                  <div class="">
                    {{infoWin_addressname}}
                  </div>
                  <div class="">
                    {{infoWin_address}}
                  </div>
                  <x-button type="primary" class=" btn-submit" @click.native="doSubmit" :disabled="isSubmiting">{{$t("message.done")}}</x-button>
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

import config from '../config'
import cFuns from '../../../utils/cFuns'
import cModel from '../../../utils/cModel'

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

          this.mapObj = o;
          if(!this.$store.state.localCity){
            this.mapObj.getCity((data)=>{
                if (data['province'] && typeof data['province'] === 'string') {
                  this.$store.commit('setLocalCity',data);
                  this.city = data.city
                  this.searchMap(1)
                }
            });
          }else{
            this.city = this.$store.state.localCity;
            this.searchMap(1)
          }
          // console.log(this)
          // console.log(o.getCenter())
        },
        'click': (e) => {
          // console.log(e)
          let position = [e.lnglat.lng,e.lnglat.lat];
          this.myMarker.position = position;
          this.myMarker.events = {
            'click': (e) => {
              this.doClickMyMarker(position);
            },
          }
          this.doClickMyMarker(position);

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
                // console.log(o);
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

  methods: {
    /**
     * 显示地图窗体
     * @param  {array} position [坐标]
     */
    showMarkerInfoWin (position){
      let infoWin_Setting = {
        position:position,
        visible:true,
      }
      this.markerInfoWin = Object.assign({},infoWin_Setting);
    },
    /**
     * 取得坐标的地址信息
     * @param  {array} lnglat  [坐标]
     * @param  {function} callback [回调函数]
     */
    getMarkerInfo (lnglat,callback){
      var geocoder = this.geocoder;
      // var marker = pageDatas.marker;
      AMap.plugin('AMap.Geocoder',()=>{
          var geocoder = new AMap.Geocoder({
              city:this.city//城市，默认：“全国”
          });
          this.geocoder = geocoder;
          // marker.setPosition(lnglat);
          geocoder.getAddress(lnglat,(status,result)=>{
            // console.log(result);
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
      this.getMarkerInfo(lnglat,(status,result)=>{
        this.infoWin_address = status=='complete' ?  result.regeocode.formattedAddress : "...";
        this.infoWin_addressname =  "";
        this.pointData = {
          longtitude:lnglat[0],
          latitude:lnglat[1],
          address:this.infoWin_address,
          city:result.regeocode.addressComponent.city
        }
        this.showMarkerInfoWin(lnglat);
      })
    },
    /**
     * 执行提交
     */
    doSubmit (){

      let pointData = this.pointData;

      let postDatas = {
        longtitude:pointData.longtitude,
        latitude:pointData.latitude,
        addressname: this.keyword,
        address:pointData.address,
        to:this.to,
        city:pointData.city
      }
      this.isSubmiting = true;

      this.$tokenAxios.post(config.urls.createAddress,postDatas).then(res => {
        this.isSubmiting = false;
        var resData = res.data.data

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
          cModel.myAddress('add',{data:inDatas,success:(result)=>{console.log(result)}});
          if(this.to == 'start' || this.to == 'end' ){
            let formData = this.$store.state.tripFormData;

            formData[this.to] =   inDatas;

            // console.log(formData);
            this.$store.commit('setTripFormData',formData);
            // console.log(formData);
            this.$router.go(-2);


          }else if( pageDatas.from == 'home' || pageDatas.from == 'company' ){

          }
        }
      })
      .catch(error => {
        this.isSubmiting = false;
        console.log(error)
      })

    },

    /**
     * 通过关键词添加标注点
     * @param  {Boolean} autoShow [是否自动弹出地图窗体]
     */
    searchMap (autoShow){

      this.city = this.$store.state.localCity.city;
      autoShow = autoShow  || 0;
      AMap.service('AMap.PlaceSearch',()=>{//回调函数
       //实例化PlaceSearch
       var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
            pageSize: 15,
            pageIndex: 1,
            city: this.city//城市
        });
        if(this.keyword_o == this.keyword || this.keyword == ''){
          return false;
        }

        this.keyword_o = this.keyword;
        // console.log(this.keyword)
        //关键字查询
        placeSearch.search(this.keyword, (status, result)=>{
          if( typeof(result.poiList)!='undefined' && result.poiList.pois.length>0){

            result.poiList.pois.forEach((value,index,arr)=>{
              value.position = [value.location.lng, value.location.lat]
              value.events= {
                click: (e) => {
                 this.setPointData(value)
                 // console.log(value)
                },
              }
              if(index===0 && autoShow){
                cFuns.amap.setCenter(value.position,this.mapObj,12);
                this.setPointData(value)

              }
             // value.visible =  true;
             // this.markers.push(value);
            })

            this.markers = result.poiList.pois;
            // console.log(this.markers);

          }else{
            if(autoShow){ //自动中央标注点信息

              let center = this.mapObj.getCenter()
              let position = [center.lng,center.lat]
              this.myMarker.position = position;
              this.getMarkerInfo(position,(status,result)=>{
                this.infoWin_address = status=='complete' ?  result.regeocode.formattedAddress : "...";
                this.infoWin_addressname =  "";
                this.showMarkerInfoWin(position);
              })
            }
          }

        });
       })
       return false;
    },

    setPointData (datas){

      this.pointData = {
        longtitude:datas.position[0],
        latitude:datas.position[1],
        address:datas.address,
        city:this.city
      }
      this.infoWin_address = datas.address;
      this.infoWin_addressname = datas.name;
      this.showMarkerInfoWin(datas.position);
    }

  },
  mounted () {
    /*lazyAMapApiLoaderInstance.load().then(() => {
      // this.mapObj = cFuns.amap.showMap("routeFormMap")

    });*/
  },
  created(){
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
