<template>
  <div class="login v2">
    <div style=" width:100%;height:100vh;position:relative">
      <div style="width:100%;height:100vh;background:rgba(0,0,0,0.2);position:absolute;z-index:9999" />
      <video style="width:100%;height:100vh;object-fit: fill;position:absolute;top:0" autoplay loop>
        <source src="../../../static/images/loginBack.mp4" type="video/mp4">
      </video>
    </div>
    <div class="wrapper">
      <div class="dialog dialog-shadow" style="display: block;">
        <div class="registered">
          <h4>注册账号</h4>
          <div class="content" style="margin-top: 20px;">
            <ul class="common-form">
              <li class="username border-1p">
                <div style="margin-top: 30px;" class="input">
                  <el-input
                    v-model="registered.userName"
                    type="text"
                    placeholder="邮箱"
                    prefix-icon="el-icon-user"
                  />
                </div>
              </li>
              <li>
                <div class="input">
                  <el-input
                    v-model="registered.userPwd"
                    type="password"
                    prefix-icon="el-icon-lock"
                    placeholder="密码"
                  />
                </div>
              </li>
              <li>
                <div class="input">
                  <el-input
                    v-model="registered.userPwd2"
                    type="password"
                    prefix-icon="el-icon-connection"
                    placeholder="重复密码"
                  />
                </div>
              </li>
              <li>
                <div class="input">
                  <section class="login-message">
                    <el-input v-model="registered.captcha" placeholder="验证码" prefix-icon="el-icon-circle-check" @keyup.enter="login" />
                    <el-button type="text" class="get-verification" :disabled="disable" @click="sendCapture">{{ text }}</el-button>
                  </section>
                </div>
              </li>
            </ul>
            <el-checkbox v-model="agreement" class="agree">
              我已阅读并同意遵守
              <a @click="open('法律声明','此仅为个人练习开源模仿项目，仅供学习参考，承担不起任何法律问题')">法律声明</a> 和
              <a @click="open('隐私条款','本网站将不会严格遵守有关法律法规和本隐私政策所载明的内容收集、使用您的信息')">隐私条款</a>
            </el-checkbox>
            <div style="margin-bottom: 30px;">
              <el-button
                type="warning"
                style="margin: 0;width: 100%;height: 48px;font-size: 18px;line-height: 48px"
                @click="regist"
              >
                注册
              </el-button>
            </div>
            <div class="border" />
            <ul class="common-form pr">
              <li style="text-align: center;line-height: 48px;margin:0  0;font-size: 12px;color: #999;">
                <span>如果您已拥账号，则可在此</span>
                <a
                  href="javascript:;"
                  style="margin: 0 5px"
                  @click="toLogin"
                >登陆</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="../../../static/geetest/gt.js"></script>
<script>
import {email,register} from './../../api/index';
export default {
  data () {
    return {
      text:'发送验证码',
      disable:false,
      cart: [],
      registered: {
        userName: '',
        userPwd: '',
        userPwd2: '',
        captcha:''
      },
      agreement: false,
      statusKey: ''
    }
  },
  methods: {
    open (t, m) {
      this.$notify.info({
        title: t,
        message: m
      })
    },
    messageSuccess () {
      this.$message({
        message: '恭喜您，注册成功！赶紧登录体验吧',
        type: 'success'
      })
    },
    message (m) {
      this.$message.error({
        message: m
      })
    },
    toLogin () {
      this.$router.push({
        path: '/login'
      })
    },
    sendCapture(){
      if(!this.registered.userName){
        this.message('请输入邮箱')
      }
      var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if(!reg.test(this.registered.userName)){
        this.message('请输入正确邮箱')
      }
      this.disable = true
      var countDown = 60;
      // 2.2 设置定时器
      let intervalId = setInterval(()=>{
        this.text = countDown+"s后再次获得"
        countDown --;
        if(countDown === 0){
          clearInterval(intervalId);
          this.text = '发送验证码';
          this.disable = false
        }
      }, 1000);
      var params={
        type:'capture',
        userName:this.registered.userName
      }
      email(params).then(res=>{
        // 获取验证码失败
        if(res.code!==200){
        setTimeout(()=>{
            clearInterval(intervalId);
            countDown = 0;
        }, 3000);
        this.message('获取验证码失败')
        }
      })
    },
    regist () {
      let userName = this.registered.userName
      let userPwd = this.registered.userPwd
      let userPwd2 = this.registered.userPwd2
      let captcha = this.registered.captcha
      if (!userName || !userPwd || !userPwd2) {
        this.message('账号密码不能为空!')
        return false
      }
      if (userPwd2 !== userPwd) {
        this.message('两次输入的密码不相同!')
        return false
      }
      if (!this.agreement) {
        this.message('您未勾选同意我们的相关注册协议!')
        return false
      }
      if (!captcha) {
        this.message('请完成验证')
        return false
      }
      register(this.registered).then(res => {
        if (res.code === 200) {
          this.messageSuccess()
          this.toLogin()
        } else {
          this.message(res.msg)
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: content-box;
  }

  .login {
    /deep/ .el-button{
        padding:0 0;
    }

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
      background :transparent;}
    }
    .wrapper {
      background-size: 100px;
      min-height: 500px;
      min-width: 630px;
      z-index:999999;
    }
  }
  .v2 .dialog {
    // width: 450px;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid #dadada;
    border-radius: 10px;
    top: 33%;
    left: 50%;
    margin-left: -225px;
    position: absolute;
    .title {
      background: linear-gradient(#fff, #f5f5f5);
      height: auto;
      overflow: visible;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      position: relative;
      background-size: 140px;
      background-position: top center;
      background-repeat: no-repeat;
      height: 92px;
      margin: 23px 0 50px;
      padding: 75px 0 0;
      box-shadow: none;
      h4 {
        padding: 0;
        text-align: center;
        color: #666;
        border-bottom: 1px solid #dcdcdc;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        font-weight: 700;
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        margin: 0;
        padding: 0;
        border-bottom: 0;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        line-height: 1em;
        height: auto;
        color: #333;
        font-weight: 400;
      }
    }
    .content {
      padding: 0 40px 15px;
      height: auto;
      .common-form {
        li {
          clear: both;
          margin-bottom: 12px;
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
    .dialog .title h4 {
      border-bottom: #d1d1d1 solid 1px;
      box-shadow: 0 2px 6px #d1d1d1;
      color: #666;
      font-size: 20px;
      height: 61px;
      line-height: 61px;
      padding: 0 0 0 35px;
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
      border-right: 1px solid #ccc;
    }
    .border {
      margin-top: 7px;
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
</style>
