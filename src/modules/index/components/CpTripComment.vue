<template>
  <li class="cp-comment-item">
    <div class="cp-avatarbox">
      <cp-avatar :src="avatar"></cp-avatar>
    </div>
    <div class="cp-mainbox">
      <div class="cp-title">
        <b class="name">{{name}}</b>
        <span class="time">{{time}}</span>
      </div>
      <div class="cp-content">
        {{content}}
        <i v-show="isSubmiting" class="cp-loadingIcon fa fa-circle-o-notch fa-spin "></i>
        <span v-show="isError" class="cp-error">{{$t("message['carpool.comments.sendFail']" )}} </span>
      </div>
    </div>
  </li>
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
    name : String,
    avatar : String,
    phone : String,
    time: String,
    content: String,
    isError:{
      default:false,
    },
    isSubmiting:{
      default:false,
    }


  },
  computed:{
  },

  methods: {


  },
  mounted () {

 }
}
</script>

<style scoped>

</style>
