<template>
  <div class="page-view cp-overhide">
    <title-bar  :left-options="{showBack: true}">详情</title-bar>
    <div class="page-view-main "   >
      <div class="cp-scroller-wrap" >

      </div>
    </div>
  </div>
</template>

<script>
import config from '../configs/index'

import CpRouteCard from '../components/CpRouteCard'
export default {
  components: {

  },
  data () {
    return {

    }
  },
  methods :{
    init (){

    },

  },
  mounted () {

  },
  created () {
    // this.$nextTick(function () {
    //  this.$refs['j-herblist-scrollBox'].addEventListener('scroll', this.listScroll); //监听滚动加载更多
    // })
  },
  activated (){
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
