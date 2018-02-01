<template>
   <div class="page-view-title">

     <section class="cp-btn-goback" v-show="leftOptions.showBack" @click.preventDefault @click="onClickBack">
            <svg   xmlns="http://www.w3.org/2000/svg" version="1.1">
                <polyline points="12,14 4,7 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
            </svg>
            {{leftOptions.backText}}
      </section>
      <slot name="left"></slot>
      <div class="cp-title" @click="$emit('on-click-title')"><span v-show="title" :transition="transition">{{title}}</span><slot></slot></div>
       <slot name="rightContent"></slot>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      defaultTitle:''
    }
  },
  props: {
    leftOptions: {
      type: Object,
      default () {
        return {
          showBack: true,
          backText: '',
          preventGoBack: false
        }
      }
    },
    title: String,
    transition: String,
    rightOptions: {
      type: Object,
      default () {
        return {
          showMore: false
        }
      }
    }
  },
  computed: {

  },
  methods : {
    goTop () {
      this.$emit('goTop');
    },
    onClickBack () {
      if (this.leftOptions.preventGoBack) {
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
