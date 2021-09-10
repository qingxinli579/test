<template>
  <div>
    <y-shelf title="账户资料">
      <div slot="content">
        <div class="info-box">
          <div class="11" />
          <div>
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="邮箱">
                <el-input v-model="userName" disabled />
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="form.phone" />
              </el-form-item>
            </el-form>
            <el-button class="btn-edit" type="warning" @click="submit">修改</el-button>
          </div>
          <div class="avatar-box">
            <div class="img-box" style="position:relative" @click="editAvatar()">
              <el-avatar v-if="!picture" icon="el-icon-user-solid" />
              <el-avatar v-else :src="picture" />
              <div style="position:absolute;bottom:45px;right:35px;font-size:30px">
                <i class="el-icon-plus" />
              </div>
            </div>
            <el-link class="edit-text" type="warning" @click="editpsw">修改密码</el-link>
          </div>
        </div>
        <!-- 弹框 -->
        <el-dialog
          title="修改密码"
          :visible.sync="dialogVisible"
          width="40%"
          :before-close="handleClose"
        >
          <el-form ref="password" :rules="rules" :model="password" label-width="80px">
            <el-form-item label="旧密码" prop="oldpsd">
              <el-input v-model="password.oldpsd" type="password" />
            </el-form-item>
            <el-form-item label="新密码" prop="newpsd1">
              <el-input v-model="password.newpsd1" type="password" />
            </el-form-item>
            <el-form-item label="再次输入" prop="newpswd2">
              <el-input v-model="password.newpswd2" type="password" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="subpsw('password')">确 定</el-button>
          </span>
        </el-dialog>
        <div v-if="editAvatarShow" class="edit-avatar">
          <y-shelf title="设置头像">
            <div slot="content" class="content">
              <div class="edit-l">
                <div style="width: 100px;height: 100px;border: 1px solid #ccc;margin-bottom: 20px;overflow: hidden;">
                  <div
                    class="show-preview"
                    :style="{'width': previews.w + 'px','height': previews.h + 'px','overflow': 'hidden','zoom':option.zoom}"
                  >
                    <div :style="previews.div">
                      <img
                        :src="option.img"
                        :style="previews.img"
                      >
                    </div>
                  </div>
                </div>
                <div class="btn">
                  <a href="javascript:;">选择图片</a>
                  <input type="file" value="上传头像" @change="upimg($event)">
                </div>
              </div>
              <div class="edit-r">
                <div>
                  <div v-if="option.img" id="cropper-target" class="big">
                    <vueCropper
                      ref="cropper"
                      :img="option.img"
                      :output-size="example2.size"
                      :info="example2.info"
                      :can-scale="example2.canScale"
                      :auto-crop="example2.autoCrop"
                      :auto-crop-width="example2.width"
                      :auto-crop-height="example2.height"
                      :fixed="example2.fixed"
                      @realTime="realTime"
                    />
                  </div>
                </div>
              </div>
              <div class="bootom-btn pa">
                <el-button
                  style="width: 140px;height: 40px;"
                  @click="editAvatarShow=false"
                >
                  取消
                </el-button>
                <el-button
                  style="width: 140px;height: 40px;"
                  type="warning"
                  @click="cropper"
                >
                  确定
                </el-button>
              </div>
            </div>
          </y-shelf>
        </div>
      </div>
    </y-shelf>
  </div>
</template>
<script>
import { edituser, getuser, modifyPsd } from '../../../api/index'
import YShelf from '../../../components/Shelf'
import vueCropper from 'vue-cropper'
import { mapMutations, mapState } from 'vuex'
import { getStore, setStore } from '../../../utils/storage'
export default {
  components: {
    YShelf,
    vueCropper
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.password.newpsd1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        oldpsd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newpsd1: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        newpswd2: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      password: {
        oldpsd: '',
        newpsd1: '',
        newpswd2: ''
      },
      dialogVisible: false,
      info: '',
      picture: '',
      fileName: '',
      form: {
        phone: '',
        name: ''
      },
      imgSrc: '',
      editAvatarShow: false,
      cropContext: '',
      cropperImg: '',
      previews: {},
      option: {
        img: '',
        zoom: 0
      },
      fixedNumber: [1, 1],
      example2: {
        info: true,
        size: 1,
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 300,
        autoCropHeight: 250,
        // 开启宽度和高度比例
        fixed: true
      },
      userName: '',
      token: ''
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created() {
    this.userName = getStore('userName')
    this.picture = getStore('headphoto')
    var params = {
      userName: this.userName
    }
    getuser(params).then(res => {
      if (res.code == 200) {
        this.info = res.data[0]
        this.form.phone = res.data[0].phone
        this.form.name = res.data[0].name
      }
    })
  },
  methods: {
    ...mapMutations([
      'RECORD_USERINFO'
    ]),
    message(m) {
      this.$message(m)
    },
    messageSuccess(m) {
      this.$message({
        message: m,
        type: 'success'
      })
    },
    messageFail(m) {
      this.$message.error({
        message: m
      })
    },
    upimg(e) {
      var file = e.target.files[0]
      this.fileName = file.name
      if (file.size > 1048576) {
        this.messageFail('图片大小不得超过1Mb')
        return false
      }
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.messageFail('图片类型仅支持.gif,jpeg,jpg,png,bmp')
        return false
      }
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        this.option.img = e.target.result
      }
    },
    cropper() {
      this.message('上传中...')
      if (this.option.img) {
        this.$refs.cropper.getCropBlob((data) => {
          var params = new FormData()
          params.append('file', data, this.fileName)
          params.append('userName', this.userName)
          console.log('12344', this.userName)
          edituser(params).then(res => {
            if (res.code == 200) {
              var info = this.info
              info.headphoto = res.headphoto
              this.$store.commit('RECORD_USERINFO', { info: info })
              this.editAvatarShow = false
              setStore('headphoto', res.headphoto)
              this.messageSuccess('上传成功')
              location.reload()
            } else {
              this.editAvatarShow = false
              this.messageFail('上传失败')
            }
          })
        })
      } else {
        this.messageFail('上传失败')
      }
    },
    editAvatar() {
      this.editAvatarShow = true
    },
    realTime(data) {
      this.previews = data
      const w = 100 / data.w
      this.option.zoom = w
    },
    submit() {
      var params = {
        name: this.form.name,
        phone: this.form.phone,
        userName: this.userName
      }
      edituser(params).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
      })
    },
    editpsw() {
      this.dialogVisible = true
    },
    subpsw(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          var params = {
            oldpsd: this.password.oldpsd,
            newpsd: this.password.newpsd1,
            userName: this.userName
          }
          modifyPsd(params).then(res => {
            if (res.code == 200) {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '修改密码成功'
              })
            } else {
              this.$message({
                type: 'success',
                message: res.msg
              })
            }
          })
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
  @import "../../../assets/style/mixin";

  .avatar-box {
    height: 124px;
    margin: 0 30px 30px;
    line-height: 30px;
    align-items: center;
    .img-box {
      margin-left: 100px;
      border-radius: 5px;
      cursor: pointer;
      :hover{
        background: rgba(0, 0, 0, .5);
      }
      .el-avatar{
        width: 100px;
        height: 100px;
      }
    }
    img {
      display: block;
      @include wh(100%)
    }
    .r-box {
      margin-left: 20px;
      h3 {
        font-size: 18px;
        font-weight: 400;
        color: #333;
      }
    }
  }
  // 修改头像
  .edit-avatar {
    z-index: 9999;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    @include wh(100%);
    background-color: rgba(0, 0, 0, .5);
    @extend %block-center;
    .content {
      display: flex;
      padding: 45px 100px 0;
    }
    > div {
      box-sizing: content-box;
      @include wh(700px, 500px);
      margin: 0;
    }
    .btn {
      width: 80px;
      height: 30px;
      margin-left: 10px;
      position: relative;
      text-align: center;
      line-height: 30px;
      text-shadow: rgba(255, 255, 255, .496094) 0 1px 0;
      border: 1px solid #E6E6E6;
      border-radius: 10px;
      a {
        color: #666;
        display: block;
        @include wh(100%);
      }
    }
    input[type=file] {
      position: absolute;
      right: 0;
      left: 0;
      top: 0;
      opacity: 0;
      width: 80px;
      height: 30px;
      cursor: pointer;
      box-sizing: border-box;
      border: 15px solid #000;
      overflow: hidden;
    }
    .edit-l {
      width: 100px;
      text-align: center;
    }
    .edit-r {
      margin-left: 20px;
      flex: 1;
      > div {
        border: 1px solid #ccc;
        width: 320px;
        height: 320px;
      }
    }
  }

  .image-container {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
  }

  .close {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    padding: 0 10px;
    @extend %block-center;
    &:hover {
      svg {
        transition: all 1s;
        transform: rotate(360deg);
        transform-origin: 50% 50%;
      }
      path {
        fill: #8a8a8a;
      }
    }
  }

  .big {
    display: block;
    width: 320px;
    height: 320px;
  }

  .bootom-btn {
    padding: 0 15px;
    border-top: 1px solid #E6E6E6;
    bottom: 0;
    height: 60px;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .info-box{
    display:flex;
    margin-top:30px;
    .el-form{
      margin-left: 50px;
    }
    .el-input{
      width:400px;
    }
  }

  .btn-edit{
    margin:0 0 40px 300px;
  }
  .edit-text{
    margin:30px 0 0 110px
  }
</style>
