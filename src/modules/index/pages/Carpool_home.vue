<template>
  <div class="page-view-index">
    <title-bar  :left-options="{showBack: false}">{{ $t("message['main.carpool']" )}}</title-bar>
    <div class="page-view-content"   style="padding-top:60px;" >
      <div class="cp-scroller-wrap" >
        <div class="cp-scroller">
          <div class="container">
            <dl class="cp-index-btn-item">
              <dt> {{ $t("message['discover.trips']" )}} </dt>
              <dd>
                <router-link  class="btn btn-ripple" to="/carpool/mytrip">
                  <i class="fa fa-map"></i> {{ $t("message['carpool.title.myTrip']" )}}
                </router-link>
                </dd>
            </dl>
            <dl class="cp-index-btn-item">
              <dt>{{ $t("message['discover.carryPassengers']" )}}</dt>
              <dd>
                <router-link  class="btn btn-ripple" to="/carpool/requests">
                  <i class="fa fa-car"></i> {{ $t("message['carpool.title.requests']" )}}
                </router-link>
              </dd>
            </dl>
            <dl class="cp-index-btn-item">
              <dt>{{ $t("message['discover.join']" )}}</dt>
              <dd>
                <router-link  class="btn btn-ripple" to="/carpool/rides">
                  <i class="fa fa-heart"></i> {{ $t("message['carpool.title.rides']" )}}
                </router-link>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div class="cp-mask" v-show="isShowAddBtns"></div>
    <div class="cp-fixed-btn-wrap" id="J-index-fixedBtnWrap" :class="{'isshow':isShowAddBtns === true}">
      <a class="btn btn-primary btn-fab btn-fab-mini   cp-btn-control btn-ripple" id="J-btn-showAdd" @click="showAddBtns" href="javascript:void(0);"><i class="fa fa-plus"></i></a>
      <div class="cp-btn-options-wrap" v-show="isShowAddBtns">
        <a href="javascript:void(0);" @click="goTripAdd('wall')" class="cp-btn-car btn btn-primary  btn-fab btn-ripple " ><i class="fa fa-car"></i><p>{{$t("message['btn.driverpublish']")}}</p></a>
        <a href="javascript:void(0);" @click="goTripAdd('info')" class="cp-btn-need btn btn-primary  btn-fab  btn-ripple"><i class="fa fa-user-o"></i><p>{{$t("message['btn.passengerpublish']")}}</p></a>
      </div>
    </div>
    <cp-foot-nav-bar current="carpool"></cp-foot-nav-bar>
  </div>
</template>

<script>

import CpFootNavBar from '../components/CpFootNavBar'
import cCoord from '@/utils/cCoord'

export default {
  components: {
     CpFootNavBar
  },
  data () {
    return {
      isShowAddBtns : false,
    }
  },
  methods:{
    showAddBtns (){
      this.isShowAddBtns = this.isShowAddBtns ? false : true
    },
    goTripAdd (type){
      this.$router.push({name:'carpool_addtrip',params: {type:type}});
    },
    jumpTo (){
      let jumpToSetting = this.$store.state.jumpTo;
      if(jumpToSetting.path || jumpToSetting.name){
        this.$store.commit('setJumpTo',{});
        this.$router.push(jumpToSetting);
      }

    }
  },
  activated (){
    cCoord().push(); // 上传用户坐标。
    this.$store.commit('setTripFormData',{});
    this.$store.commit('setIsRefreshCarpoolList',true);

    this.jumpTo();

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
