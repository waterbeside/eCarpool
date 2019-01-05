<template>
  <div class="page-view"  id="Page-position">
    <div class="page-view-inner" >
      <cp-goback-btn></cp-goback-btn>
      <div class="page-view-main" >
        <div class="cp-map-wrapper">
          <div  id="mapContainer-position"  class="map-box"  > </div>
          <div class="cp-msg" v-show="is_showMsg">{{msg}}</div>
          <div class="cp-msg" v-show="isLoading">{{$t('message.loading')}}...</div>
        </div>

        <div class="cp-main-panel-wrapper">

          <name-card   :name='user.name' :department='user.department_format' >
            <div slot="after" class="cp-name-card-btns">
              <button class="btn-refreshPosition" @click="getData"><i class="fa  fa-refresh" :class="{'fa-spin':isLoading}"></i></button>
            </div>
          </name-card>

        </div>
        <!-- /cp-map-wrap -->
      </div>
    </div>
  </div>
</template>

<script>
import config from '../config'
import cAmap from '@/utils/cAmap'
import { lazyAMapApiLoaderInstance } from 'vue-amap';
import cFuns from '@/utils/cFuns'
import cCoord from '@/utils/cCoord';
import NameCard from '../components/CpNameCard'

export default {
  components: {
    NameCard,
  },
  data () {
    return {
      uid: this.$route.params.uid,
      id:this.$route.params.id,
      from:this.$route.params.from,
      tips:null,
      mapObj:null,
      userCoord: null,
      marker:null,
      isLoading:false,
      user:{
        name:"-",
        department_format:"-",
      },
      tripData:null,
      is_showMsg:false,
      msg:"",
    }
  },
  computed:{
  },
  watch:{
    userCoord(val,oval){
      if(!this.mapObj || !val){
        return false;
      }
      if(this.marker){
        cAmap.removeMarker(this.marker,this.mapObj);
      }
      if(val){
        this.marker = this.showUserCoord(val);

      }
    }
  },
  methods: {
    /**
     * 初始化地图
     */


    mapInit (){
      return new Promise ((resolve, reject) => {
        if(!this.mapObj){
          lazyAMapApiLoaderInstance.load().then(() => {
           cAmap.showMap('mapContainer-position', {
              resizeEnable: true,zoom: 10, zoomToAccuracy:false,enableHighAccuracy:false,
            }).then(map=>{
              this.mapObj = map;
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


    getData(){
      return new Promise ((resolve, reject) => {
        if(this.isLoading){
          return false;
        }
        this.isLoading = true;
        this.is_showMsg = false;
        this.$http.get(config.urls.trips+"/"+this.from+"/"+this.id+"/user/"+this.uid+'/position').then(res=>{
          var result = res.data;

          if(res.data.code === 0){
            this.user = result.data.userData;
            this.user.department = this.user.department ? this.user.department : '-' ;
            this.user.department_format = this.user.full_department ? cFuns.formatDepartment(this.user.full_department) : this.user.department;
            this.userCoord = result.data.position;
            this.tripData = result.data.tripData;
          }else{
            this.is_showMsg = true;
            this.msg = result.desc;
          }
          setTimeout(()=>{
            this.isLoading = false;
          },500)
          resolve(res);
        }).catch(err=>{
          setTimeout(()=>{
            this.isLoading = false;
          },500)
          reject(err);

        })
      })

    },



    /**
     * 显示用户坐标
     */
    showUserCoord (data,setting){
      var position = data;
      var image =    require('@/assets/images/passenger.png');

       var mapObj = this.mapObj;
       var defaults = {
         position:position,
         map: mapObj,
         autoCenter:true,
         icon: image,
       }


     // return cAmap.addMarker([112.8592886032,22.9054378951],mapObj);
     // cAmap.setCenter(position,mapObj)
      return cAmap.addMarker(defaults);
    },



  },
  mounted () {
//
  },
  created(){

  },
  activated (){
    if(this.marker){
       cAmap.removeMarker(this.marker,this.mapObj);
    }
    this.uid = this.$route.params.uid;
    this.id = this.$route.params.id;
    this.from = this.$route.params.from;
    this.userCoord = null;
    this.user={
      name:"-",
      department_format:"-",
    };
    // if(this.infoid){
    //
    //   var infoData = this.$store.state.carpoolInfoDetail ;
    //   if(!infoData){
    //     this.$router.back();
    //   }
    //   console.log(this.$store.state.carpoolInfoDetail);
    //   this.user = {
    //     name:infoData.p_name,
    //     department:infoData.p_department,
    //   }
    // }else{
    //   console.log(this.$store.state.carpoolWallDetail);
    //
    // }

    this.mapInit().then(()=>{
      this.getData().then(res=>{

      });

      // this.getUserCoord(this.uid).then(res=>{
      //   console.log(res);
      // })
    })


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
