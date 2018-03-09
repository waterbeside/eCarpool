<template>
  <div class="cp-search-box-wrapper">
    <div class="cp-search-box" v-show="isShowSearchBox">
      <input name="keyword" class="form-control form-control-line" :placeholder="placeholder"  v-model="currentValue" autocomplete="false"
       ref="input"
        v-focus="isFocus"
        @keyup="onKeyup"
        @focus="onFocus"
        @blur="onBlur"
        @compositionstart="onComposition($event, 'start')"
        @compositionend="onComposition($event, 'end')"
        @input="onComposition($event, 'input')"
        />
    </div>
    <div class="cp-btn-wrapper">
      <button class="cp-btn-search" v-show="!isShowSearchBox" @click="showSearchBox(1)"><i class="fa fa-search"></i></button>
      <button class="cp-btn-close" v-show="isShowSearchBox" @click="showSearchBox(0)"><i class="fa fa-times"></i></button>
    </div>
  </div>
</template>

<script>


export default {
  components: {

  },
  data () {
    return {
      onInput: false,
      currentValue: '',
      isCancel: true,
      isFocus: false,
      isShowSearchBox:false

    }
  },
  props: {
    placeholder : {
      default:"请输入关键字查找"
    },
    isInputDefaultShow : {
      default:0
    },

    value:'',
  },
  computed: {
    /*currentValue: {
      // 动态计算currentValue的值
      get:function() {
        return this.value;
      },
      set:function(val) {
        this.$emit('input', val);
      }
    }*/
  },

  methods: {
    emitEvent () {
      this.$nextTick(() => {
        this.$emit('input', this.currentValue)
        this.$emit('on-change', this.currentValue)
      })
    },
    onComposition ($event, type) {
      if (type === 'start') {
        this.onInput = true
      }
      if (type === 'end') {
        this.onInput = false
        this.emitEvent()
      }
      if (type === 'input') {
        if (!this.onInput) {
          this.emitEvent()
        }
      }
    },
    /**
     * [showSearchBox 显示或关闭搜索输入]
     */
    showSearchBox (show){
      this.isShowSearchBox = show ? 1 : 0;
      if(show==0){
        this.$emit('on-hide-input')
      }else{
        this.$emit('on-show-input')
        this.isFocus = true
        this.setFocus();
      }
    },

    setFocus () {
      this.isFocus = true;
    },
    setBlur () {
      this.isFocus = false;
    },
    onFocus () {
      this.isFocus = true;
      this.$emit('on-focus')
      // this.touch()
    },
    onBlur () {
      this.isFocus = false
      this.$emit('on-blur')
    },
    onKeyup () {
      this.$emit('on-keyup')
    },

  },
  created () {
    if (this.value) {
      this.currentValue = this.value
    }
    if (this.isInputDefaultShow){
      this.showSearchBox(1)
    }
  },
}
</script>

<style scoped lang="less">



</style>
