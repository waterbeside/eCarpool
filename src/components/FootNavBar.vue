<template>
  <!--<tabbar>
    <tabbar-item link="/im" :class="{'active weui-bar__item_on' : current=='im'}" >
      <i slot="icon" class="cp-iconfont fa fa-comment"></i>
      <span slot="label">溢信</span>
    </tabbar-item>
    <tabbar-item link="/" :class="{'active weui-bar__item_on' : current=='carpool'}"   >
      <i slot="icon"  class="cp-iconfont fa fa-car"></i>
      <span slot="label">拼车</span>
    </tabbar-item>
    <tabbar-item link="/user" :class="{'active weui-bar__item_on' : current=='user'}">
      <i slot="icon"  class="cp-iconfont fa fa-user"></i>
      <span slot="label">我的</span>
    </tabbar-item>
  </tabbar>-->
  <div class="cp-bar cp-bar-tab cp-footer"  id="footer">
    <div class="router-link cp-bar-tab-item "  :class="{'active' : current=='im'}">
      <router-link :to="{ name: 'im' }">
        <i class="cp-iconfont fa fa-comment"></i>
        <div class="cp-bar-tab-label">溢信</div>
      </router-link>
    </div>
    <div   class="router-link cp-bar-tab-item" :class="{'active' : current=='carpool'}">
      <router-link :to="{ name: 'carpool' }">
        <i class="cp-iconfont fa fa-car"></i>
        <div class="cp-bar-tab-label">拼车</div>
      </router-link>
    </div>
    <div   class="router-link cp-bar-tab-item" :class="{'active' : current=='user'}">
      <router-link :to="{ name: 'user' }">
        <i class="cp-iconfont fa fa-user"></i>
        <div class="cp-bar-tab-label">我的</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
    }
  },
  props: [ 'current'],
  computed: {
    route () {
      return this.$store.getters.route
    }
  },
  methods: {
    changePage (page) {
      console.log(page)
    }
  }
}
</script>
<style   scoped>
  .p {margin: 0}
</style>
