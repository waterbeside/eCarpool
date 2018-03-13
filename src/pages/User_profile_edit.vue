
<template>
  <div class="page-view-index">
    <title-bar >编辑</title-bar>
    <div class="page-view-main"   >
      <cp-scroller :position="{top:'46px'}"  :enableRefresh="false" :enableInfinite="enableInfinite">

      </cp-scroller>
    </div>
  </div>
</template>

<script>


export default {
  data () {
    return {
      isEnableSubmit : false,
      // msg      : 'Welcome to Your Vue.js App'
    }
  },
  methods:{

  },
  activated (){
  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
