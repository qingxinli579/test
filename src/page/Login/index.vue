<template>
  <div class="login v2">
    <div style=" width:100%;height:240px;position:relative">
      <div style="width:100%;height:100vh;background:rgba(0,0,0,0.2);position:absolute;z-index:9999" />
      <video style="width:100%;height:100vh;object-fit: fill;position:absolute;top:0" autoplay loop>
        <source src="../../../static/images/loginBack.mp4" type="video/mp4">
      </video>
    </div>
    <div class="wrapper">
      <div class="dialog dialog-shadow" style="display: block;">
        <div class="content">
          <el-tabs v-model="activeName">
            <el-tab-pane label="密码登录" name="first">
              <ul class="common-form">
                <li class="username border-1p">
                  <div class="input">
                    <el-input v-model="ruleForm.userName" type="text" placeholder="邮箱" prefix-icon="el-icon-user" />
                  </div>
                </li>
                <li>
                  <div class="input">
                    <el-input
                      v-model="ruleForm.password"
                      type="password"
                      placeholder="密码"
                      prefix-icon="el-icon-lock"
                    />
                  </div>
                </li>
                <li>
                  <div class="input">
                    <section class="login-message">
                      <el-input
                        v-model="ruleForm.captcha"
                        type="text"
                        maxlength="4"
                        placeholder="验证码"
                        prefix-icon="el-icon-circle-check"
                        @keyup.enter="login"
                      />
                      <img
                        ref="captcha"
                        class="get-verification"
                        src="http://192.168.43.16:3000/captcha"
                        alt="captcha"
                        @click.prevent="getCaptcha()"
                      >
                    </section>
                  </div>
                </li>
                <li style="text-align: right" class="pr">
                  <el-checkbox v-model="autoLogin" class="auto-login">记住密码</el-checkbox>
                  <a href="javascript:;" class="register" @click="toRegister">注册账号 </a>
                  <span>|</span>
                  <a style="padding: 1px 0 0 10px" @click="open('找回密码','请联系17860516155@163.com')">忘记密码 ?</a>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="验证码登录" name="second">
              <ul class="common-form">
                <li class="username border-1p">
                  <div class="input">
                    <el-input v-model="ruleForm2.userName" type="text" placeholder="邮箱" prefix-icon="el-icon-user" />
                  </div>
                </li>
                <li>
                  <div class="input">
                    <section class="login-message">
                      <el-input v-model="ruleForm2.captcha" placeholder="验证码" prefix-icon="el-icon-circle-check" @keyup.enter="login" />
                      <el-button type="text" class="get-verification" :disabled="disable" @click="sendCapture">{{ text }}</el-button>
                    </section>
                  </div>
                </li>
                <li style="text-align: right" class="pr">
                  <a href="javascript:;" class="register" @click="toRegister">注册账号</a>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
          <!--登陆-->
          <div style="margin-top: 25px">
            <el-button
              type="warning"
              style="margin: 0;width: 100%;height: 48px;font-size: 18px;line-height: 48px"
              @click="login"
            >登录</el-button>
          </div>
          <!--返回-->
          <div>
            <el-button
              style="marginTop: 10px;marginBottom: 15px;width: 100%;height: 48px;font-size: 18px;line-height: 48px"
              @click="login_back"
            >
              返回
            </el-button>
          </div>
          <div class="border" />
          <div class="footer">
            <div class="other">其它账号登录：</div>
            <a><img style="height: 15px; margin-top: 22px;" src="../../../static/images/other-login.png" @click="open('待开发','此功能开发中...')"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setStore, getStore, removeStore } from '../../utils/storage.js'
import { pwdLogin, email, captchaLogin } from './../../api/index'
export default {
  data() {
    return {
      text: '发送验证码',
      disable: false,
      activeName: 'first',
      cart: [],
      ruleForm: {
        userName: '',
        password: '',
        captcha: ''
      },
      ruleForm2: {
        userName: '',
        captcha: ''
      },
      autoLogin: false,
      statusKey: ''
    }
  },
  mounted() {
    this.getRemembered()
  },
  methods: {
    open(t, m) {
      this.$notify.info({
        title: t,
        message: m
      })
    },
    messageSuccess() {
      this.$message({
        message: '恭喜您，注册成功！赶紧登录体验吧',
        type: 'success'
      })
    },
    message(m) {
      this.$message.error({
        message: m
      })
    },
    // 发送验证码
    sendCapture() {
      if (!this.ruleForm2.userName) {
        this.message('请输入邮箱')
        return false
      }
      var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!reg.test(this.ruleForm2.userName)) {
        this.message('请输入正确邮箱')
        return false
      }
      this.disable = true
      var countDown = 60
      // 设置定时器
      const intervalId = setInterval(() => {
        this.text = countDown + 's后再次获得'
        countDown--
        if (countDown === 0) {
          clearInterval(intervalId)
          this.text = '发送验证码'
          this.disable = false
        }
      }, 1000)
      var params = {
        type: 'capture',
        userName: this.ruleForm2.userName
      }
      email(params).then(res => {
      // 获取验证码失败
        if (res.code !== 200) {
          setTimeout(() => {
            clearInterval(intervalId)
            countDown = 0
          }, 3000)
          this.message('获取验证码失败')
        }
      })
    },
    //  获取图形验证码
    getCaptcha() {
      this.$refs.captcha.src = 'http://192.168.43.16:3000/captcha?time=' + new Date()
    },
    getRemembered() {
      var judge = getStore('remember')
      if (judge === 'true') {
        this.autoLogin = true
        this.ruleForm.userName = getStore('rusername')
        this.ruleForm.password = getStore('rpassword')
      }
    },
    rememberPass() {
      if (this.autoLogin === true) {
        setStore('remember', 'true')
        setStore('rusername', this.ruleForm.userName)
        setStore('rpassword', this.ruleForm.password)
      } else {
        setStore('remember', 'false')
        removeStore('rusername')
        removeStore('rpassword')
      }
    },
    toRegister() {
      this.$router.push({
        path: '/register'
      })
    },
    // 登录返回按钮
    login_back() {
      this.$router.go(-1)
    },
    login() {
      // 密码登陆
      if (this.activeName === 'first') {
        this.rememberPass()
        if (!this.ruleForm.userName || !this.ruleForm.password) {
          this.message('账号或者密码不能为空!')
          return false
        }
        if (!this.ruleForm.captcha) {
          this.message('请完成验证')
          return false
        }
        pwdLogin(this.ruleForm).then(res => {
          if (res.code === 200) {
            this.$store.commit('RECORD_USERINFO', { info: res.data })
            setStore('token', res.token)
            setStore('userName', this.ruleForm.userName)
            setStore('headphoto', res.data[0].headphoto)
            this.$router.push({
              path: '/'
            })
          } else {
            this.message(res.msg)
          }
        })
      } else {
        if (!this.ruleForm2.userName) {
          this.message('账号不能为空!')
          return false
        }
        if (!this.ruleForm2.captcha) {
          this.message('请完成验证')
          return false
        }
        captchaLogin(this.ruleForm2).then(res => {
          if (res.code === 200) {
            setStore('token', res.token)
            setStore('userName', this.ruleForm.userName)
            this.$router.push({
              path: '/'
            })
          } else {
            this.message(res.msg)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
* {
  box-sizing: content-box;
}

.login {
  .input {
    height: 50px;
    align-items: center;
    position: relative;
    /deep/ .el-input__inner{
      height: 50px;
    }

  }
  .login-message{
    position :relative;
    margin-top: 16px,;
    height: 100%;
    font-size: 14px;
    background: #fff;
    .get-verification{
      position: absolute;
      top: 50%;
      right: 10px;
      transform :translateY(-50%);
      border: 0;

      font-size :14px;
      background :transparent;
    }
  }
  .wrapper {
    background-size: 100px;
    min-height: 500px;
    min-width: 630px;
    z-index:999999;
  }
}

.v2 .dialog {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #dadada;
  border-radius: 10px;
  top: 33%;
  left: 50%;
  margin-left: -225px;
  position: absolute;
  .content {
    padding: 0 40px 22px;
    height: auto;
    /deep/ .el-tabs__active-bar {
       background: #ebb563;
    }
    /deep/ .el-tabs__item.is-active{
      color: #ebb563;
    }
    /deep/ .el-tabs__header {

        margin: 15px -40px 25px;
    }
    /deep/ .el-tabs__nav{
      margin-left:125px
    }
    .common-form {
      li {
        clear: both;
        margin-bottom: 15px;
        position: relative;
      }
    }
  }
}
.dialog-shadow,
.v2 .bbs .dialog-shadow,
.v2 .dialog-shadow {
  -webkit-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
  -moz-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
  box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
}

@media screen and (min-width: 737px),
  screen and (-webkit-max-device-pixel-ratio: 1.9) and (max-width: 736px) and (min-device-width: 737px) {
  .wrapper {
    // background: url(../../../static/images/con-bg_04f25dbf8e.jpg) repeat-x;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .dialog {
    background: url(../../../static/images/dialog-gray-bg.png) #fff bottom repeat-x;
    border-radius: 12px;
    display: none;
    margin: -163px 0 0 -218px;
    width: 436px;
    position: fixed;
    left: 50%;
    top: 50%;
  }

  .common-form li {
    clear: both;
    margin-bottom: 15px;
    position: relative;
  }
  .auto-login {
    position: absolute;
    top: 0px;
    left: 2px;
    color: #999;
  }
  .register {
    padding: 1px 10px 0;
  }
  .border {
    margin-top: 10px;
    border-bottom: 1px solid #ccc;
  }
  .other {
    margin: 20px 5px 0 0;
    width: auto;
    color: #bbb;
    font-size: 12px;
    cursor: default;
    color: #999;
  }
  .footer {
    display: flex;
    flex-direction: row;
  }
  .agree {
    margin-bottom: 30px;
    color: #999;
  }
}

.registered {
  h4 {
    padding: 0;
    text-align: center;
    color: #666;
    border-bottom: 1px solid #dcdcdc;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    font-weight: 700;
    font-size: 20px;
    height: 60px;
    line-height: 60px;
  }
}

#wait {
  text-align: left;
  color: #999;
  margin: 0;
}
.el-button{
  padding: 0 0;
}
</style>
