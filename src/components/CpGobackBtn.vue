<template>
   <div class="cp-btn-goback-wrapper">
     <section class="cp-btn-goback"   @click.preventDefault @click="onClickBack">
            <svg   xmlns="http://www.w3.org/2000/svg" version="1.1">
                <polyline points="12,14 4,7 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
            </svg>
      </section>

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
    preventGoBack:false,
  },
  computed: {

  },
  methods : {

    onClickBack () {
      if (this.preventGoBack) {
        this.$emit('onClickBack')
      } else {

        if (window.history.length <= 1 ) {


          this.$router ? this.$router.push({name:'carpool'}) : window.history.back();
        } else {
          this.$router ? this.$router.back() : window.history.back();
        }
      }
    }
  },
}
</script>
