<template>
  <div>
     <i class="cp-iconfont" :class="icon"></i>
     <countup :start-val="0" :end-val="num" :duration="duration" class="num"></countup>
     <b class="t">'{{unit}}</b>
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
