<template>
  <img class="cp-avatar " :src="src" :onerror="'this.src=\''+defaultAvatar+'\';return false'">
</template>

<script>
import config from '../configs'

export default {
  components: {
  },
  data () {
    return {
      defaultAvatar: config.defaultAvatar,
    }
  },
  props: {
    src:{
      default: config.defaultAvatar,
    },
  },
  computed: {

  },
  methods : {
  }
}
</script>
