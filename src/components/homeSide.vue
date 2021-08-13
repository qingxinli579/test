<template>
  <div class="side">
    <a href="#up">
      <div class="up">
        <i class="el-icon-top icon" />
      </div>
    </a>
    <el-popover
      placement="left"
      width="400"
      trigger="click"
      text-color="red"
    >
      <div>
        <h1>您的使用体验如何呢？</h1>
        <div class="star">
          <el-rate
            v-model="score"
            show-text
          />
        </div>

      </div>

      <div slot="reference" class="su">
        <i class="el-icon-s-promotion icon" />
      </div>
      <h1>相关建议与意见</h1>
      <div class="input">
        <el-input v-model="suggest" />
      </div>
      <el-button type="warning" @click="submit">提交</el-button>
    </el-popover>
  </div>

</template>
<script>
import { addsuggest } from '../api/index'
import { getStore } from '../utils/storage'
export default {
  data() {
    return {
      suggest: '',
      score: null
    }
  },
  methods: {
    submit() {
      var params = {
        userName: getStore('userName'),
        suggest: this.suggest,
        score: this.score
      }
      addsuggest(params).then(res => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '评价成功'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    a{
        color: #666;
    }
    .side{
        position:fixed;
        right:0;
        bottom:0;
        z-index: 9999;
    }
    .up,.su{
        margin:20px 5px;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: gainsboro;
    }
    .icon{
        font-size: 25px;
        padding-left:3px;
        /* align-content: center; */
        line-height: 35px;
        /* align-items: center;ss */
    }
    .star{
        padding:10px 0 20px 10px;
        /deep/ .el-rate__icon {
            font-size: 30px;
        }
        /deep/ .el-rate__text{
            // font-size: 25px;
        }
    }
    .input{
        padding:10px 0 20px 10px;
    }
</style>
