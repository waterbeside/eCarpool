<template>
  <div class="page-view"  id="Page-trip-add">
    <div class="page-view-inner" >
      <!-- <title-bar  :left-options="{showBack: true}">{{type=="info"?"发布约车需求":"发布空座位"}}</title-bar> -->
      <cp-goback-btn></cp-goback-btn>

      <div class="page-view-main" >


          <div   class="cp-map-wapper cp-map-wapper-addtrip">
            <div   id="amapContainer"  class="amap-box"  style="height:100%"></div>



            <div class="cp-tools-wrapper">
              <router-link    :to="'/carpool/addtrip/history/'+type">
                <svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M49.166722 803.556967a44.05248 44.05248 0 1 0 0 88.150118h235.751891a435.173469 435.173469 0 0 1-39.197901-88.150118H49.166722z m0-573.043505h793.441379a44.075059 44.075059 0 1 0 0-88.172698H49.166722a44.075059 44.075059 0 1 0 0 88.172698z m0 440.795748h176.322815c0-30.211285 3.070803-59.677449 8.873718-88.150118H49.166722a44.0299 44.0299 0 1 0 0 88.150118z m617.118564-352.623051c-194.747635 0-352.645631 157.897996-352.645631 352.645631S471.537651 1023.977421 666.285286 1023.977421s352.623051-157.897996 352.623051-352.645631-157.875416-352.645631-352.623051-352.645631z m0 661.193623c-170.429583 0-308.547992-138.140989-308.547992-308.570572 0-170.407003 138.11841-308.570572 308.547992-308.570571s308.570572 138.140989 308.570572 308.570571-138.140989 308.570572-308.570572 308.570572zM49.166722 362.761218a44.0299 44.0299 0 1 0 0 88.150118h235.751891a440.276422 440.276422 0 0 1 66.812551-88.150118h-302.564442z m661.193623 132.247756h-88.150118v220.397875h220.397874v-88.172698H710.360345v-132.225177z"  /></svg>
              </router-link>
            </div>
            <div class="cp-computebox-wrapper" v-show="isShowComputebox">
              <div class="cp-computebox-inner">
                <h5>{{$t("message['carpool.addtrip.estimate']")}}</h5>
                <div class="cp-content">
                  <div class="cp-item"><i class="fa fa-map-signs"></i><b>{{computeBoxData.distance}}</b></div>
                  <div class="cp-item"><i class="fa fa-clock-o"></i><b>{{computeBoxData.time}}</b></div>
                </div>
              </div>
            </div>



          </div>
          <!-- /cp-map-wrap -->
          <div class="cp-map-form">
            <form   method="post" onsubmit="return false;">
            <div class="cp-userbar">
              <div class="cp-avatar-wrap">
                <cp-avatar :src="avatar"></cp-avatar>
              </div>
              <div class="cp-userinfo">
                <span class="cp-username">{{userData.name}}</span>

                <span class="cp-pull-right">{{type=="info"? $t("message['carpool.addtrip.addRequest']") : $t("message['carpool.addtrip.shareemptyseat']") }}</span>
              </div>
            </div>
            <div class="cp-map-form-inner">
              <div class="cp-trip-wrapper" :class="{'exchanging':exChangeAddressing}">
                <div class="cp-selectbtn-wrap cp-startp-wrap" :class="{'isNull':startIsNull}">
                  <div class="cp-selectbtn"  @click="selectAddress('start')" >
                    <span class="cp-label">
                      <i class="fa fa-map-marker"></i><span class="cp-title">{{$t("message['label.from']")}}</span>
                    </span>
                    <span class="cp-text">{{startName}}</span>
                  </div>
                </div>
                <div class="cp-btn-change" @click="exChangeAddress">
                      <svg class="icon"   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M947.368 607.782c-19.538-19.572-51.196-19.572-70.734 0l-58.855 58.98c-0.601 0.604-1.632 0.178-1.632-0.675V311.256c0-97.337-78.735-176.243-175.865-176.243-88.322 0-161.419 65.24-173.958 150.252a0.95 0.95 0 0 1-0.939 0.814h-0.018a0.956 0.956 0 0 0-0.956 0.955v427.063c0 41.714-33.747 75.532-75.371 75.532-41.63 0-75.372-33.818-75.372-75.532V236.678c0-0.528-0.064-1.07-0.073-1.557-0.232-12.572-6.916-28.194-16.49-37.788-19.623-19.664-58.22-16.88-77.844 2.784L77.139 342.542c-19.624 19.668-19.624 51.549 0 71.211 19.624 19.67 51.437 19.67 71.061 0l63.332-63.465c0.601-0.603 1.632-0.177 1.632 0.675v363.134c0 97.337 78.74 176.243 175.876 176.243 88.312 0 161.413-65.241 173.952-150.252a0.95 0.95 0 0 1 0.939-0.814h0.018a0.956 0.956 0 0 0 0.956-0.956V311.256c0-41.714 33.748-75.532 75.377-75.532 41.624 0 75.371 33.818 75.371 75.532v477.418c0 0.528 0.103 2.972 0.155 3.456 1.2 10.934 6.132 24.789 14.497 33.173 19.533 19.572 56.072 14.683 75.605-4.89L947.368 678.66c19.527-19.57 19.527-51.304 0-70.877z" /></svg>
                </div>
                <div class="cp-selectbtn-wrap cp-endp-wrap" :class="{'isNull':endIsNull}">
                  <div class="cp-selectbtn"  @click="selectAddress('end')">
                    <span class="cp-label">
                      <i class="fa fa-map-marker"></i><span class="cp-title">{{$t("message['label.to']")}}</span>
                    </span>

                    <span class="cp-text">{{endName}}</span>
                  </div>
                </div>
              </div>
              <div class="cp-selectbtn-wrap cp-needTime-sWrap" id="J-needTime" >

                <popup-picker class="cp-selectbtn"    v-model="formData.time" :data="timeDataArray" :display-format="formatDateDisplay"
                :cancelText="$t('message.cancel')"
                :confirmText="$t('message.done')">
                  <template slot="title" slot-scope="props">
                    <span class="cp-label">
                      <i class="fa fa-clock-o"></i><span class="cp-title" style="vertical-align:middle;">{{$t("message['label.startTime']")}}</span>
                    </span>
                  </template>
                </popup-picker>
              </div>

              <div class="cp-selectbtn-wrap cp-seatCount-sWrap" id="J-pick-seatCount" v-if="type=='wall'">
                <div class="cp-selectbtn" >
                  <x-number :title="'<span class=\'cp-label\'><i class=\'fa fa-users\'></i><span class=\'cp-title\' style=\'vertical-align:middle;\'>'+$t('message[\'label.needseats\']')+'</span></span>'"    v-model="formData.seat_count" button-style="round" :min="1" :max="10" fillable ></x-number>
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


              <button class="cp-btn  cp-btn-submit "   :disabled="disableSubmitBtn" style="border-radius:99px;" @click="doSubmit"><i class="cp-icon fa fa-paper-plane"></i>{{$t("message['publish']")}}</button>

            </div>
          </form>
          </div>

      </div>
    </div>
  </div>
</template>

<script>

import config from '../config'
import cFuns from '@/utils/cFuns'
import cModel from '@/utils/cModel'
import CpAvatar from '@/components/CpAvatar'
import { lazyAMapApiLoaderInstance } from 'vue-amap';

import {  XNumber  } from 'vux'


// import { AMapManager } from 'vue-amap';

export default {
  components: {
    CpAvatar,XNumber
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

      mapObj:null,


      disableSubmitBtn:true,
      formatDateDisplay: function (value, name) {
        return name.split(" ")[0]+" "+`${value[1]}`+":"+`${value[2]}`
      },
      // avatar: config.defaultAvatar,
      defaultAvatar: config.defaultAvatar,
      computeBoxData:{distance:"",time:""},
      city:"",
      exChangeAddressing : false,
      isShowComputebox:false,
    }
  },
  computed:{
    startName (){
      return this.formData.start.addressname ? this.formData.start.addressname : this.$t("message['placeholder.startp']");
    },
    endName (){
      return this.formData.end.addressname ? this.formData.end.addressname : this.$t("message['placeholder.endp']");
    },
    startIsNull (){
      return this.formData.start.addressname ? false : true;
    },
    endIsNull (){
      return this.formData.end.addressname ? false : true;
    },
    timeDataArray (){
      return cFuns.returnNeedTimeDatas(0,0,[this.$t("message.today"),this.$t("message.tomorrow")])
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

    'formData.time':function(val,oldval){
      let formData = this.$store.state.tripFormData;
        formData.time = val;
        this.$store.commit('setTripFormData',formData);
        // console.log(this.$store.state.tripFormData);
    },
    'formData.seat_count':function(val,oldval){
      let formData = this.$store.state.tripFormData;
        formData.seat_count = val;
        this.$store.commit('setTripFormData',formData);
        // console.log(this.$store.state.tripFormData);
    },
  },
  methods: {
    //地图初始化
    mapInit (){
      return new Promise ((resolve, reject) => {
        if(!this.mapObj){
          lazyAMapApiLoaderInstance.load().then(() => {
            this.mapObj = cFuns.amap.showMap('amapContainer', {
              resizeEnable: true,zoom: 10
            })
            if(!this.$store.state.localCity){
              cFuns.amap.getCity(this.mapObj).then((data)=> {
                if (data['province'] && typeof data['province'] === 'string') {
                  this.$store.commit('setLocalCity',data);
                  this.city = data.city
                }
              });
            }
            resolve(this.mapObj);
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

    //跳到地址业选地址
    selectAddress (to){
      this.$router.push({name:'carpool_address',params: {to:to}})
    },

    /**
     * [getDataFromStore 取得已存的数据]
     */
    getDataFormStore (){
      let formData_s = this.$store.state.tripFormData;

      if(formData_s){
        this.markerAndDraw(formData_s);
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
      if(this.startIsNull && this.endIsNull){
        return false;
      }
      this.exChangeAddressing = true;
      let formData_o = this.$store.state.tripFormData;
      // var formData_n =  this.$store.state.tripFormData;
      let startp = typeof(formData_o.start)!="undefined" && typeof(formData_o.start.latitude)!="undefined"  ? formData_o.start : {};
      let endp   = typeof(formData_o.end)!="undefined"  && typeof(formData_o.end.latitude)!="undefined" ? formData_o.end  : {};
      formData_o.end =  startp  ;
      formData_o.start = endp;
      this.formData =  Object.assign({}, formData_o);
      this.$store.commit('setTripFormData',formData_o);
      this.getDataFormStore();

      setTimeout(()=>{this.exChangeAddressing = false},500);
    },

    /**
     * 标记并画线
     * @param  object formData_s 起终点的座标数据
     */
    markerAndDraw (formData_s){
      if(formData_s.start && formData_s.start.latitude ){
        this.formData.start =  formData_s.start
        if(!this.formData.end.latitude){
          cFuns.amap.setCenter([parseFloat(formData_s.start.longtitude),parseFloat(formData_s.start.latitude)],this.mapObj);
          cFuns.amap.addMarker([parseFloat(formData_s.start.longtitude),parseFloat(formData_s.start.latitude)],this.mapObj);
        }
      }
      if(formData_s.end && formData_s.end.latitude){
        this.formData.end =  formData_s.end
        if(!this.formData.start.latitude){
          cFuns.amap.setCenter([parseFloat(formData_s.end.longtitude),parseFloat(formData_s.end.latitude)],this.mapObj);
          cFuns.amap.addMarker([parseFloat(formData_s.end.longtitude),parseFloat(formData_s.end.latitude)],this.mapObj);
        }
      }
      if(formData_s.start && formData_s.end && formData_s.start.latitude && formData_s.end.latitude){ //画线
        this.mapObj.clearMap()
        var start = new AMap.LngLat(parseFloat(formData_s.start.longtitude), parseFloat(formData_s.start.latitude));
        var end = new AMap.LngLat(parseFloat(formData_s.end.longtitude), parseFloat(formData_s.end.latitude));

        cFuns.amap.drawTripLine(start, end,this.mapObj,(status,result)=>{

          if(status == 'complete'){
            this.isShowComputebox = true;
            var distance = result.routes[0].distance; //计出的距离
            var distanceStr = cFuns.amap.formatDistance(distance);
            var dtTime = result.routes[0].time;
            var dtTimeStr = cFuns.amap.formatTripTime(dtTime,[this.$t('message.hours'),this.$t('message.minutes')]);
            this.computeBoxData = {distance:distanceStr,time:dtTimeStr}
            this.formData.distance = distance;
          }else{
            var data= this.$t("message['carpool.addtrip.tooLong']");
            this.computeBoxData = {distance:distanceStr,time:dtTimeStr}
            this.formData.distance = 0;
          }
        });
      }
    },
    /**
     * 提交数据
     */
    doSubmit (){
      let startData = this.formData.start;
      let endData = this.formData.end;
      let postData = {
        datetime:this.formData.time[0]+" "+this.formData.time[1]+":"+this.formData.time[2],
        startpid:this.formData.start.addressid,
        endpid:this.formData.end.addressid ,
        start:this.formData.start,
        end:this.formData.end,
        distance : this.formData.distance,
        from:this.type,
      }
      postData.start['addressid'] = startData.addressid ? startData.addressid : 0
      if(this.type == "wall"){
        postData.seat_count = this.formData.seat_count
      }

      this.$http.post(config.urls.addTrip,postData).then(res => {

        var resData = res.data.data
        if(res.data.code === 0) {
          this.$vux.toast.text(this.$t("message.publishSuccess"));
          if(resData.createAddress.length>0){
            // console.log(rs.data.createAddress)
            var newDatas = resData.createAddress;
            for(i=0;i<newDatas.length;i++){
              newDatas[i].addressname = newDatas[i].name;
              newDatas[i].listorder = 3;
              newDatas[i].address_type = 'new';
              newDatas[i].is_show = 1;
              cModel.myAddress('add',{data:newDatas[i]});
              // pageMethods.addAddressToDB(newDatas[i]);
            }
          }
          this.$store.commit('setJumpTo',{name:"carpool_mytrip"});
          this.$router.push({name:'carpool'});
        }else{
          this.$vux.toast.text(res.data.desc);

        }
      })
      .catch(error => {
        console.log(error)
      })
    }


  },
  created(){
    // console.log(AMap);
    this.type = this.$route.params.type;
    // console.log(this.mapObj)
    // this.loadUserInfo()
  },
  mounted () {
    this.mapInit().then((res)=>{
      this.getDataFormStore()
      if(typeof(this.formData.time[0])=="undefined"){
        let d = new Date();
        this.formData.time = [cFuns.formatDayItemData(d).value, cFuns.fixZero(d.getHours())+"",cFuns.fixZero(d.getMinutes())+""];
      }
      if(!this.formData.seat_count){
        this.formData.seat_count = 4;
      }
      if(this.formData.time && this.formData.start.longtitude && this.formData.end.longtitude &&  ( this.formData.seat_count || this.type == "info" ) ){
        this.disableSubmitBtn = false ;
      }
    })

  },

  activated (){

    // },200)
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
