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

          <name-card   :name='user.name' :department='user.department_format' :avatar='user.avatar'>
            <div slot="after" class="cp-name-card-btns">
              <a class="btn-refreshPosition" href="javascript:void(0);" @click="getData"><i class="fa  fa-refresh" :class="{'fa-spin':isLoading}"></i></a>
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
import cGmap from '@/utils/cGmap'
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
        cGmap.removeMarker(this.marker);
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
          cGmap.showMap('mapContainer-position').then(map=>{
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
            if(!result.data.position){
              setTimeout(()=>{
                this.is_showMsg = true;
                this.msg = result.desc;
              },500)

            }
            this.user = result.data.userData;
            this.user.department = this.user.department ? this.user.department : '-' ;
            this.user.department_format = this.user.full_department ? cFuns.formatDepartment(this.user.full_department) : this.user.department;
            this.user.avatar = config.avatarBasePath + this.user.imgpath;
            this.userCoord = result.data.position;
            this.tripData = result.data.tripData;
          }else{
            setTimeout(()=>{
              this.is_showMsg = true;
              this.msg = result.desc;
            },500)
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
      var position = {lat:data.latitude,lng:data.longitude};
      var image = {
        // url: require('@/assets/images/car.png'),
         url: require('@/assets/images/passenger.png'),
         // This marker is 20 pixels wide by 32 pixels high.
         size: new google.maps.Size(40, 60),
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
     cGmap.setCenter(position,mapObj)
      return cGmap.addMarker(defaults);
    },



  },
  mounted () {

  },
  created(){

  },
  activated (){
    if(this.marker){
       cGmap.removeMarker(this.marker);
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
