
<template>
  <div class="page-view-index">
    <title-bar  :left-options="{showBack: false}">溢起拼车</title-bar>

    <cp-foot-nav-bar current="im"></cp-foot-nav-bar>
  </div>
</template>

<script>

import CpFootNavBar from '../components/CpFootNavBar'

export default {
  components: {
     CpFootNavBar
  },
  data () {
    return {


    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
