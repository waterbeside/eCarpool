<template>
  <div class="page-view page-view-profile-edit" id="Page-user-profile-avatar">
    <title-bar >{{$t("message['user.avatar.title']")}}</title-bar>
    <div class="page-view-main"   >
      <cp-scroller :position="{top:'46px'}"  :enableRefresh="false" :enableInfinite="false">
        <div  class="cp-cropper-wrapper"  v-show="isSelected">
          <vueCropper
            ref="cropper"
            :img="avatar_img"
            :outputSize="1"
            outputType="jpeg"
            :autoCrop="true"
            :autoCropWidth = "200"
            :autoCropHeight = "200"
            :fixed = "true"
            :fixedNumber = "[1,1]"
          ></vueCropper>
        </div>
        <div class="cp-btn-wrapper">
          <button   @click="done"  class="cp-btn-submit btn btn-success btn-lg btn-block" :disabled="isSubmiting"  v-show="isSelected">{{$t("message.done")}}</button>

          <div class="cp-selectpic-btn">
            <label class="btn btn-default btn-block btn-lg" for="uploads" >{{$t("message['user.avatar.selectImage']")}}</label>
  					<input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event)" >
          </div>


        </div>
      </cp-scroller>
    </div>
  </div>

</template>

<script>

import config from '../config'
import VueCropper from 'vue-cropper'

export default {
  components: {
    VueCropper
  },
  data () {
    return {

      isSelected : false,
      isSubmiting : false,
      userData:'',
      avatar_img: config.defaultAvatar,
    }
  },
  
  methods: {
    uploadImg (e) {
			//上传图片
			// this.option.img
			var file = e.target.files[0]
			if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
				 alert(this.$t("message['user.avatar.imageFormat']"));
				 return false
			 }
			var reader = new FileReader()
			reader.onload = (e) => {
				let data
				if (typeof e.target.result === 'object') {
					// 把Array Buffer转化为blob 如果是base64不需要
					data = window.URL.createObjectURL(new Blob([e.target.result]))
				} else {
					data = e.target.result
				}
        this.avatar_img = data

			}
			// 转化为base64
			// reader.readAsDataURL(file)
			// 转化为blob
			reader.readAsArrayBuffer(file)
      this.isSelected = true;
		},

    /**
     * 上传图片
     */
    done () {
      this.$refs.cropper.getCropData((data) => {
        // do something
        // console.log(data)
      })
      this.$refs.cropper.getCropBlob((data) => {
        // console.log(data)
        let userData = this.$store.state.userData;
        let loginname = userData.loginname;

        let param = new FormData(); //创建form对象
        param.append('upload',data);//通过append向form对象添加数据
        param.append('loginname',loginname);//添加form表单中其他数据

        // console.log(param.get('upload')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去

        let httpConfig = {
              headers:{'Content-Type':'multipart/form-data'}
            };  //添加请求头
        this.isSubmiting = true;
        this.$http.post(config.urls.uploadAvatar,param,httpConfig).then(res => {

          this.isSubmiting = false;
          let picname = res.data ;
          let picname_l = picname.toLowerCase() ;

          if( picname.length > 0 && (picname_l.indexOf('jpg') > 0 || picname_l.indexOf('jpeg') > 0 || picname_l.indexOf('png') > 0 || picname_l.indexOf('gif') > 0 ) ){
            this.$refs.cropper.getCropData((data) => {
              this.$store.commit('setUserAvatar',data);
            })
            userData.avatar  = picname;
            userData.imgpath = picname;
            this.$store.commit('setUserData',userData);
          }else{
            this.$vux.toast.text(this.$t("message['user.avatar.failed']"));
          }
          this.$router.back();
        }).catch(error => {
          this.isSubmiting = false;
          this.$vux.toast.text(this.$t("message['user.avatar.failed']"));
          this.$router.back();
          return false;
        })
      })
    }
  },
  mounted () {
    this.userData = Object.assign({},this.$store.state.userData);
  },
}
</script>


<style>


.cropper-view-box,.cropper-face {
  border-radius: 50%;
}
.cropper-modal {
  background: rgba(0,0,0,.2);
}


</style>
