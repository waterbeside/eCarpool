<template>
  <div class="cp-trip-passennger " :data-id="id" :data-uid="uid">
    <cp-avatar :src="avatar" ></cp-avatar>
    <div class="cp-txt">
      <h4 class="media-heading">{{name}}</h4>
      <p>{{department ? department : "-"}}</p>
    </div>
    <div class="time">
      {{time}}
    </div>
    <cp-trip-box :start_name="start_name" :end_name="end_name" labelStart="" labelEnd="">
        <div slot="route-middle" class="cp-center-wrap"><div class="inner"> </div></div>
    </cp-trip-box>
    <div class="cp-btns-bar">
      <a href="javascript:void(0);" class="btn" @click="clickPhone"><i class="fa fa-phone"></i> {{$t("message['contact']")}}</a>
      <a href="javascript:void(0);" class="btn" @click="onClickPosition(id,uid,$event)"><i class="fa fa-map-marker"></i> {{$t("message['position']")}}</a>
      <a href="javascript:void(0);" class="btn" @click="onClickCancel(id,uid,$event)"><i class="fa fa-times"></i> {{$t("message['cancel']")}}</a>
    </div>
  </div>
</template>

<script>

import CpTripBox from './CpTripBox'
import CpAvatar from '@/components/CpAvatar'
import { Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'

export default {
  components: {
    CpAvatar,CpTripBox,   Swipeout, SwipeoutItem, SwipeoutButton
  },
  data () {
    return {
    }
  },
  props: {
    id : {
      default:0
    },
    uid : {
      default:0
    },
    name : String,
    avatar : String,
    phone : String,
    department : String,
    start_name : String,
    end_name : String,
    time: String,
    date: String,
    allowCancel: {
      default:true,
    },
    allowPosition: {
      default:true,
    }

  },
  computed:{
  },

  methods: {
    clickPhone (){
      if(this.phone){
        window.location.href = "tel:"+this.phone;
      }else{
        alert(this.$t('message["carpool.detail.noPhone"]'));
      }
    },
    onClickPosition (id,uid,e){
      this.$emit('on-click-position',id,uid,e);
    },
    onClickCancel (id,uid,e){
      this.$emit('on-click-cancel',id,uid,e);
    },

  },
  mounted () {

 }
}
</script>

<style scoped>

</style>
