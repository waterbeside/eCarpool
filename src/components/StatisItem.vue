<template>
  <div>
     <b v-if="title" class="title">{{title}}</b>
     <slot name="title"></slot>
     <i class="cp-iconfont" :class="icon" v-if="icon"></i>
     <div class="num_unit_wrapper">
       <slot name="num"></slot>
       <countup v-if="typeof(num)!='undefined'" :start-val="0" :end-val="num" :duration="duration" class="num"></countup>
       <b class="unit"  v-if="unit">{{unit}}</b>
     </div>

   </div>

</template>

<script>
import { Countup } from 'vux'

export default {
  components: {
    Countup
  },
  data () {
    return {
    }
  },
  props: {
    title:String,
    num : {},
    icon : String,
    unit : String,
    duration : {
      default:2
    }
  },
  methods: {

  }
}
</script>

<style scoped >


</style>
