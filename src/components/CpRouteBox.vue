<template>
  <div class="cp-route-box">
      <div class="cp-route-line"><div class="cp-line"></div></div>
      <div class="cp-route-content">
        <div class="cp-item cp-start">
          <b class="cp-p"></b>
          <h4>{{start_name}}</h4>
          <label>{{labelStart}}</label>
        </div>
        <slot name="route-middle"></slot>
        <div class="cp-item  cp-end">
          <b class="cp-p"></b>
          <h4>{{end_name}}</h4>
          <label>{{labelEnd}}</label>
        </div>
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
  props: {
    start_name : String,
    end_name : String,
    labelStart : {
      default:"出发 FROM"
    },
    labelEnd : {
      default:"结束 TO"
    }
  },

  methods: {

  }
}
</script>

<style scoped lang="less">



</style>
