<template>
  <div class="page-view"  id="Page-address-add">
    <div class="page-view-inner" >
      <!-- <title-bar  :left-options="{showBack: true}">{{type=="info"?"发布约车需求":"发布空座位"}}</title-bar> -->
      <cp-goback-btn></cp-goback-btn>
      <div class="page-view-main" >
        <div class="cp-map-wapper  cp-map-wapper-addtrip">
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
import cAmap from '@/utils/cAmap'
// import { AMapManager } from 'vue-amap';
import { lazyAMapApiLoaderInstance } from 'vue-amap';
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
    //地图初始化
    mapInit (){
      return new Promise ((resolve, reject) => {
        if(!this.mapObj){
          lazyAMapApiLoaderInstance.load().then(() => {
           cAmap.showMap('mapContainer-createAddress', {
              resizeEnable: true,zoom: 10, zoomToAccuracy:false,enableHighAccuracy:this.keyword ? false : true,
            }).then(map=>{
              this.mapObj = map;
              if(!this.$store.state.localCity){
                cAmap.getCity(this.mapObj).then((data)=> {
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
              resolve(this.mapObj);
            }).catch((error) => {
                reject(error);
              }
            )
          }).catch((error) => {
              reject(error);
            }
          );
        }else{
          cAmap.clear(this.mapObj);
          resolve(this.mapObj);
        }
      })
    },
    /**
     * 显示地图窗体
     * @param  {array} position [坐标]
     */
    showMarkerInfoWin (position){
      var infoWindow = cAmap.showInfoWindow({position:position,content: this.$refs.infoWindow},this.mapObj);
    },
    getGeocoder(){
      return new Promise ((resolve, reject) => {
        if(this.geocoder){
          resolve(this.geocoder);
        }else{
          cAmap.getGeocoder(this.city).then(res=>{
            this.geocoder = res;
            resolve(res);
          })
        }
      })
    },
    /**
     * 取得坐标的地址信息
     * @param  {array} lnglat  [坐标]
     * @param  {function} callback [回调函数]
     */
    getMarkerInfo (lnglat){
        return this.getGeocoder().then(geocoder=>{
           return cAmap.getMarkerInfo(lnglat,this.geocoder);
        })
    },
    /**
     * 点击myMarker时弹出信息窗体
     * @param {array} lnglat [坐标]
     */
    doClickMyMarker (lnglat){
      this.getMarkerInfo(lnglat).then(res=>{
        let status  = res.status
        let result = res.result
        this.infoWin_address = status=='complete' ?  result.regeocode.formattedAddress : "...";
        this.infoWin_addressname =  "";
        this.pointData = {
          longitude:lnglat[0],
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
        longitude:pointData.longitude,
        latitude:pointData.latitude,
        addressname: this.keyword,
        address:pointData.address,
        to:this.to,
        city:pointData.city
      }
      this.isSubmiting = true;
      this.$http.post(config.urls.address,postDatas).then(res => {
        this.isSubmiting = false;
        var resData = res.data.data
        if(res.data.code === 0){
          var inDatas = {
            addressid:resData.addressid,
            listorder:3,
            addressname: postDatas.addressname,
            latitude: postDatas.latitude,
            longitude: postDatas.longitude,
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
        }else{
          this.$vux.toast.text(res.data.desc);
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
      if(this.keyword_o == this.keyword || this.keyword == ''){
        return false;
      }
      this.keyword_o = this.keyword;
      cAmap.placeSearch(this.keyword,{city:this.city}).then(res=>{
        var result = res.result;
        var status = res.status;
        if( typeof(result.poiList)!='undefined' && result.poiList.pois.length>0){
          cAmap.clear(this.mapObj);
          this.markers = [];
          result.poiList.pois.forEach((value,index,arr)=>{
            value.position = [value.location.lng, value.location.lat]
            if(index===0 && autoShow){
              cAmap.setCenter(value.position,this.mapObj,12);
              this.setPointData(value)
            }
            let markerOpt = index ===0 ? {color:'red'} : {}
            var marker = cAmap.addMarker(value.position,this.mapObj,markerOpt);

            marker.on('click',ev=>{
              if(this.myMarker){
                cAmap.removeMarker(this.myMarker,this.mapObj);
              }
              this.resetMarkers();
              this.setPointData(value)
              cAmap.setMarkerColor(marker,"red");

            })
           // value.visible =  true;
           this.markers.push(marker);
          })
        }else{
          if(autoShow){ //自动中央标注点信息
            let center = this.mapObj.getCenter()
            let position = [center.lng,center.lat]
            this.myMarker = cAmap.addMarker(position,this.mapObj,{color:'red',autoCenter:true});
            // this.myMarker.position = position;
            this.getMarkerInfo(position).then(res=>{
              this.infoWin_address = res.status=='complete' ?  result.regeocode.formattedAddress : "...";
              this.infoWin_addressname =  "";
              this.showMarkerInfoWin(position);
            });
          }
        }
      });
      return false;
    },
    //设置站点信息到表单
    setPointData (datas){
      this.pointData = {
        longitude:datas.position[0],
        latitude:datas.position[1],
        address:datas.address,
        city:this.city
      }
      this.infoWin_address = datas.address;
      this.infoWin_addressname = datas.name;
      this.showMarkerInfoWin(datas.position);
    },
    //重置marker颜
    resetMarkers (){
      if(this.markers.length > 0){
        this.markers.forEach((maker,index)=>{
          cAmap.setMarkerColor(maker,"blue");
        })
      }
    }

  },
  mounted () {
    /*lazyAMapApiLoaderInstance.load().then(() => {
      // this.mapObj = cAmap.showMap("routeFormMap")
    });*/
  },
  created(){
    // console.log(AMap);
    this.mapInit().then((res)=>{
      this.mapObj.on('click', (ev)=>{
        if(this.myMarker){
          cAmap.removeMarker(this.myMarker,this.mapObj);
        }
        this.resetMarkers();
        let position = [ev.lnglat.lng,ev.lnglat.lat];
        this.myMarker = cAmap.addMarker(position,this.mapObj,{color:'red',autoCenter:true});
        this.doClickMyMarker(position);
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
