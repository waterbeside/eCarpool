<template>
  <div class="page-view"  id="Page-address-add">
    <div class="page-view-inner" >
      <!-- <title-bar  :left-options="{showBack: true}">{{type=="info"?"发布约车需求":"发布空座位"}}</title-bar> -->
      <cp-goback-btn></cp-goback-btn>
      <div class="page-view-main" >
        <div class="cp-map-wapper">
          <div   id="mapContainer-createAddress"  class="amap-box"  style="height:100%"></div>
          <div class="cp-form-panel-wrapper">
                <div class="form-horizontal">
                  <form @submit.prevent="searchMap(0)">
                    <div class="cp-form-group ">
                      <label  class="control-label"  for="addressname"><i class="fa fa-map-marker"></i>{{$t("message['address.stationName']")}}</label>
                      <input class="form-control form-control-line" type="text" name="keyword"  ref="keywordBox"  v-model="keyword"   v-focus="isFocusKeyword" @focus="isFocusKeyword=true" @blur="isFocusKeyword=false" :placeholder="$t('message[\'placeholder.addressname\']')"/>
                    </div>
                  </form>
                  <div class="addressname">
                    {{infoWin_addressname}}
                  </div>
                  <div class="address">
                    {{$t("message.detail")}}：{{infoWin_address}}
                  </div>
                  <x-button type="primary" class=" btn-submit" @click.native="doSubmit" :disabled="isSubmiting">{{$t("message.done")}}</x-button>
                </div>
          </div>


        </div>
        <!-- /cp-map-wrap -->
      </div>
    </div>
  </div>
</template>

<script>
import config from '../config'
import cFuns from '@/utils/cFuns'
import cModel from '@/utils/cModel'
import cGmap from '@/utils/cGmap'

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
      mapObj:null, //存放地图实例对象
      markers:[], //标记点列表
      myMarker:null, //点击地图空白位置的标记点
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
     * 初始化地图
     */
     mapInit (){
      return new Promise ((resolve, reject) => {
        if(!this.mapObj){
          cGmap.showMap('mapContainer-createAddress').then(map=>{
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
     * 执行提交
     */
    doSubmit (){
      if(!this.keyword.trim()){
        this.$vux.toast.text(this.$t("message['placeholder.addressname']"));
        return false;
      }
      let pointData = this.pointData;
      var inDatas = {
        addressid:0,
        listorder:3,
        map_type:1,
        addressname: this.keyword,
        latitude: pointData.latitude,
        longitude: pointData.longitude,
        address:pointData.address,
        is_show:true,
        address_type:'new'
      };

      if(this.to == 'start' || this.to == 'end' ){
        let formData = this.$store.state.tripFormData;
        formData[this.to] =   inDatas;
        // console.log(formData);
        this.$store.commit('setTripFormData',formData);
        // console.log(formData);
        this.$router.go(-2);
      }else if( pageDatas.from == 'home' || pageDatas.from == 'company' ){
      }

    },

    setPointData (datas){
      var position = cGmap.formatCoords(datas.position)
      this.pointData = {
        longitude:position.lng(),
        latitude:position.lat(),
        address:datas.address,
        city:datas.city
      }
      this.infoWin_address = datas.address;
      // this.infoWin_addressname = datas.name;
    },

    addMarkerAndShowWin(position){
      this.myMarker = cGmap.addMarker(position,this.mapObj);
      this.infoWin_address = "..."
      cGmap.reGeocoder(position,this.mapObj).then(res=>{
        var addressInfo = res[0];
        var cityObj = cGmap.formatCitys(addressInfo);
        this.setPointData({
          position:position,
          address:cityObj.formatted_address,
          city:cityObj.city,
        })
        cGmap.showInfoWindow({content:cityObj.formatted_address},this.mapObj,this.myMarker);
      });
    }
  },
  mounted () {
    /*lazyAMapApiLoaderInstance.load().then(() => {
      // this.mapObj = cFuns.amap.showMap("routeFormMap")
    });*/
  },
  created(){
    // console.log(AMap);
    this.mapInit().then(res=>{
      var centerPosition = this.mapObj.getCenter();
      this.addMarkerAndShowWin(centerPosition);

      this.mapObj.addListener('click', ev=>{

        if(this.myMarker){
          cGmap.removeMarker(this.myMarker);
        }
        this.addMarkerAndShowWin(ev.latLng);
        console.log(typeof(ev.latLng.lat));
      /*  if(this.myMarker){
          cFuns.amap.removeMarker(this.myMarker,this.mapObj);
        }
        let position = [ev.lnglat.lng,ev.lnglat.lat];
        this.myMarker = cFuns.amap.addMarker(position,this.mapObj);
        this.doClickMyMarker(position);*/
        // console.log(position)
      });
    })
    this.to = this.$route.params.to;
    this.keyword = this.$route.params.keyword;
    // this.searchMap(1);
  },
  activated (){
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
