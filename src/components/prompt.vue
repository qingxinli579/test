<template>
<div class="item">
    <el-dialog
        :show-close=false
        title="关于交易的重要提示"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
            <div v-for="(item,i) in warningdata" :key=i>
                <p class="text">
                {{i+1}}、{{item.content}}
            </p>
            </div>
        <i class="icon el-icon-close" @click="change"></i>
    </el-dialog>
    
</div>
    
</template>
<script>
import {getwarning} from '../api/index';
export default {
  data(){
    return{
        warningdata:''
    }
  },
  props: ["dialogVisible"],

  methods: {
    change(){
        this.$emit('changef')
    }
  },
  created(){
      getwarning().then(res=>{
        if(res.code==200){
          this.warningdata=res.data
        }
        
      })
  }
};
</script>

<style lang="scss" scoped>
.item{
    position: relative;
    z-index: 99999999;
     /deep/ .el-dialog__wrapper{
        border-radius: 20px;
    }
    // /deep/ .el-dialog__header{
    //     border-radius: 1000px;
    // }
    // /deep/ .el-dialog{
    //      border-radius: 50px;
    // }
    /deep/ .el-dialog__title{
        margin-left:30%;
    }
    /deep/ .el-dialog__header{
        background: rgba(255, 166, 0, 0.671);
    }
    .icon{
        position: absolute;
        bottom: -40px;
        left:50%;
        font-size: 28px;
        color: #fff;
        cursor: pointer;
    }
    .text{
        padding-bottom: 10px;
    }
}

</style>