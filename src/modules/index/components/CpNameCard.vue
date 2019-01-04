<template>
   <div class="cp-name-card">
     <slot name="before"></slot>
     <div class="cp-avatar-wrapper">
       <cp-avatar :src="avatar"></cp-avatar>
     </div>
     <div class="cp-mainbox">
       <slot name="before-content"></slot>
       <div class="cp-content">
         <div class="name">{{name}}</div>
         <div class="department">{{department}}</div>
         <slot name="more"></slot>
       </div>
       <slot name="after-content"></slot>
     </div>
     <slot name="after"></slot>
  </div>
</template>

<script>
import CpAvatar from '@/components/CpAvatar'

export default {
  components: {
    CpAvatar
  },
  data () {
    return {

    }
  },
  props: {

    name : String,
    avatar : String,
    department : String,
  },
  computed: {

  },
  methods : {

  },
}
</script>
