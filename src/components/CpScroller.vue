<template lang="html">
    <div class="cp-scroll"  :class="{'down':(state===0),'up':(state==1),refresh:(state===2),touch:touching}" :style="style"  @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)" @scroll="scroll($event)">
        <slot name="before-inner"></slot>
        <section :id="innerID" class="cp-scroll-inner" :class="{'cp-enableRefresh':enableRefresh}" :style="innerStyleEX"  ref="scrollInner">
            <div class="pull-refresh" v-show="enableRefresh">
                <slot name="pull-refresh">
                    <span class="down-tip">{{$t("message['scroller.pullToRefresh']")}}</span>
                    <span class="up-tip">{{$t("message['scroller.refreshing']")}}</span>
                    <span class="refresh-tip">{{$t("message['scroller.loosenToRefresh']")}}</span>
                </slot>
            </div>
            <slot>
            </slot>
            <div class="load-more-wrapper" v-show="enableInfinite">
              <div class="load-more">
                      <span v-show="downFlag === false"><slot name="loadmore-text">{{$t("message['scroller.pullUpGetMore']")}}</slot></span>
                      <span v-show="downFlag === true"><slot name="loading-text">{{$t("message['scroller.loadingMore']")}}</slot></span>
              </div>
            </div>
            <div class="nullData" v-show="enableInfinite && dataList.noFlag">{{$t("message.noMore")}} ⁽⁽ƪ(ᵕ᷄≀ ̠˘᷅ )ʃ⁾⁾</div>
        </section>
        <slot name="after-inner"></slot>
    </div>
</template>

<script>
    export default {
        props: {
            innerStyle:{
              type: Object,
              default: ()=>{return {}}
            },
            position:{
              type:Object,
              default: ()=>{
                return {top:0,left:0,right:0,bottom:0}
              }
            },
            offset: {
                type: Number,
                default: 60 //默认高度
            },
            enableInfinite: {
                type: Boolean,
                default: true
            },
            enableRefresh: {
                type: Boolean,
                default: true
            },
            dataList: {
                default: function(){ return {noFlag:false}},
                required: false
            },
            onRefresh: {
                type: Function,
                default: undefined,
                required: false
            },
            onInfinite: {
                type: Function,
                default: undefined,
                require: false
            },
            innerID: {
                type: String,
                default: 'cp-scroll-inner'
            },
        },
        computed :{
          style (){
            let styleStr = ""
            styleStr +=  this.position.top ? "top:"+this.position.top+";" : "";
            styleStr +=  this.position.right  ? "right:"+this.position.right+";" : "";
            styleStr +=  this.position.bottom ? "bottom:"+this.position.bottom+";" : "";
            styleStr +=  this.position.left  ? "left:"+this.position.left+";" : "";

            return styleStr;
          },
          innerStyleEX (){
            return Object.assign({transform: 'translate3d(0, ' + this.top + 'px, 0)' },this.innerStyle)

          }
        },
        data() {
            return {
                top: 0,
                state: 0,
                startX: 0,
                startY: 0,
                touching: false,
                infiniteLoading: false,
                downFlag: false, //用来显示是否加载中
            }
        },
        methods: {
            touchStart(e) {
                this.startY = e.targetTouches[0].pageY;
                this.startX = e.targetTouches[0].pageX;
                this.startScroll = this.$el.scrollTop || 0;
                this.touching = true; //留着有用，不能删除

                this.dataList.noFlag = false;
                this.$el.querySelector('.load-more').style.display = 'block';
            },
            touchMove(e) {

                if(!this.enableRefresh ||  this.dataList.noFlag || !this.touching) {
                    return
                }
                let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
                if(diff > 0) e.preventDefault()
                this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)
                if(this.state === 2) { // in refreshing
                    return
                }
                if(this.top >= this.offset) {
                    this.state = 1
                } else {
                    this.state = 0
                }

                let more = this.$el.querySelector('.load-more');
                if(!this.top && this.state === 0 ) {
                    more.style.display = 'block';
                } else {
                    more.style.display = 'none';
                }
            },
            touchEnd(e) {

                if(!this.enableRefresh) {
                    return
                }
                this.touching = false
                if(this.state === 2) { // in refreshing
                    this.state = 2
                    this.top = this.offset
                    return
                }
                if(this.top >= this.offset) { // do refresh
                    this.refresh()
                } else { // cancel refresh
                    this.state = 0
                    this.top = 0
                }

                //用于判断滑动是否在原地 ----begin
                let endX = e.changedTouches[0].pageX,
                    endY = e.changedTouches[0].pageY,
                    dy = this.startY - endY,
                    dx = endX - this.startX;

                //如果滑动距离太短
                if(Math.abs(dx) < 5 && Math.abs(dy) < 5) {
                    // console.log("滑动距离太短")
                    return;
                }

                //--------end--------

                if(!this.enableInfinite || this.infiniteLoading) {
                    return false;
                }

                let outerHeight = this.$el.clientHeight,
                    innerHeight = this.$el.querySelector('.cp-scroll-inner').clientHeight,
                    scrollTop = this.$el.scrollTop,
                    ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-refresh').clientHeight : 0,
                    bottom = innerHeight - outerHeight - scrollTop - ptrHeight;

                // console.log(bottom + " __ " + this.offset)

                if(bottom <= this.offset && this.state === 0 ) {
                    this.downFlag = true;
                    this.infinite();
                } else {
                    this.$el.querySelector('.load-more').style.display = 'none';
                    this.downFlag = false;
                }

            },
            refresh() {
                this.state = 2;
                this.top = this.offset;
                setTimeout(() => {
                    this.onRefresh(this.refreshDone)
                }, 1000);
            },
            refreshDone() {
                this.state = 0
                this.top = 0
            },

            infinite() {
                this.infiniteLoading = true

                setTimeout(() => {
                    this.onInfinite(this.infiniteDone);
                }, 2000);
            },

            infiniteDone() {
                this.infiniteLoading = false
            },
            scroll (e){
              this.$emit('on-scroll',e);
            }

        },
        mounted () {

        },
        created () {

        },
        activated (){
        }
    }
</script>
<style lang="less">

</style>
