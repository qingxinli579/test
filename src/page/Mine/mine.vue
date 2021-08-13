<template>
  <div class="layout-container">
    <div class="w">
      <div class="content">
        <div class="account-sidebar">
          <div class="avatar gray-box ">
            <div>
              <img v-if="picture!='null'" :src="picture">
              <img v-else src="../../../static/images/logo.png" alt="">
            </div>
            <div class="box-inner">
              <ul class="account-nav">
                <li
                  v-for="(item,i) in nav"
                  :key="i"
                  :class="{current:item.name===title}"
                  @click="tab(item)"
                >
                  <a href="javascript:;">{{ item.name }}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="account-content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getStore } from '../../utils/storage'
export default {
  data() {
    return {
      title: '我的订单',
      nav: [
        { name: '我的收藏', path: 'mycollect' },
        { name: '账户资料', path: 'information' },
        { name: '我的发布', path: 'mypublish' }
      ],
      editAvatar: true
    }
  },
  created() {
    this.picture = getStore('headphoto')
  },
  methods: {
    tab(e) {
      this.$router.push({ path: '/mine/' + e.path })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/style/mixin";
  .layout-container{
    min-height: 100vh;
  }
  .w {
    padding-top: 100px;
  }

  .content {
    display: flex;
    height: 100%;
  }

  .account-sidebar {
    position: fixed;
    width: 210px;
    border-radius: 6px;
    .avatar {
      padding-top: 20px;
      border-radius: 10px;
      text-align: center;
      img {
        width: 168px;
        height: 168px;
      }
      h5 {
        font-size: 18px;
        line-height: 48px;
        font-weight: 700;
      }
    }
    .account-nav {
      padding-top: 15px;
      li {
        position: relative;
        height: 48px;
        border-top: 1px solid #EBEBEB;
        line-height: 48px;
        &:hover {
          a {
            position: relative;
            z-index: 1;
            height: 50px;
            background-color: #98AFEE;
            line-height: 50px;
            color: #FFF;
          }

        }
        a {
          display: block;
        }
        &.current {
          a {
            position: relative;
            z-index: 1;
            height: 50px;
            background-color: #98AFEE;
            line-height: 50px;
            color: #FFF;
          }
        }

      }
    }
  }
  .account-content {
    margin-left: 230px;
    flex: 1;
  }
</style>
