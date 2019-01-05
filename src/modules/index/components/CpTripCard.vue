<template>
  <div class="cp-tripCard-item col-sm-6 col-md-4 " :data-id="id" :data-from="dataFrom">
    <div class="cp-tripCard-item-inner" >
      <div class="cp-avatar-wrap">
        <cp-avatar :src="avatarPath"></cp-avatar>
      </div>
      <div class="cp-user-wrapper">
        <div class="cp-name-bar">
          <h4>{{name}}</h4>
          <span class="cp-phone" v-if="isShowPhoneBtn"><a :href="'tel:'+phone" onclick="event.stopPropagation();"><i class="fa fa-phone"></i></a></span>
          <span class="h8">{{typeLabel}}</span>
        </div>
        <div class="cp-userInfo-bar">
          <span class="cp-dept">{{department}}</span>
          <b class="cp-carnumber">{{carnumber}}</b>
        </div>
      </div>
      <div class="cp-body">

        <cp-trip-box :start_name="start_name" :end_name="end_name">
            <div slot="route-middle" class="cp-date-wrap"><b class="cp-time">{{time}}</b><span class="cp-date">{{date}}</span></div>
        </cp-trip-box>
        <slot name="btnbar"></slot>
      </div>
    </div>
  </div>

</template>

<script>
import config from '@/config'

import CpTripBox from './CpTripBox'
import CpAvatar from '@/components/CpAvatar'
export default {
  components: {
    CpAvatar,CpTripBox,
  },
  data () {
    return {
    }
  },
  props: {
    id : {},
    dataFrom : {},
    name : String,
    avatar : String,
    phone : String,
    typeLabel : String,
    department : String,
    carnumber : String,
    start_name : String,
    end_name : String,
    date: String,
    time: String,
    isShowPhoneBtn:true

  },
  computed:{
    avatarPath (){
      return  this.avatar && this.avatar.trim()!='' ?  config.avatarBasePath + this.avatar : config.defaultAvatar;
    }
  },

  methods: {

  },
  mounted () {

 }
}
</script>

<style scoped>

</style>
