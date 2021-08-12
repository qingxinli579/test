admin<template>
  <div>
    <y-shelf title="我的发布">
      <div slot="content">
        <div v-loading="loading" element-loading-text="加载中..." style="min-height: 10vw;" v-if="goodlist.length">
          <div v-for="(item,i) in goodlist" :key=i>
            <div class="good">
              <div class="image">
                <img :src="item.goods_picture.split('#')[0]">
              </div>
              <div class="right">
                <div class="brand">{{item.brand}} {{item.color}}</div>
                <div class="second">
                  <div>售价：{{item.price}}万元</div>
                  <div>
                    |
                  </div>
                  <div>发布时间：{{item.addtime.substring(0,10)}}</div>
                </div>
                <div style="margin-left:20px">
                  车辆状态：
                  <el-tooltip content="信息填写成功等待审核" placement="right">
                    <el-tag size='small' v-if="item.status==0" type="warning">
                      <i >
                        等待审核
                      </i>
                    </el-tag>
                  </el-tooltip>
                  <el-tooltip content="后台正在审核请耐心等待" placement="right">
                    <el-tag  size='small' v-if="item.status==2" type="warning">
                      <i >
                        正在审核
                      </i>
                    </el-tag>
                  </el-tooltip>
                  <el-tooltip content="审核成功，商品已发布" placement="right">
                    <el-tag  size='small'  v-if="item.status==1" type="success">
                      <i >
                        审核成功
                      </i>
                    </el-tag>
                  </el-tooltip>
                  <el-tooltip content="点击查看失败原因" placement="right">
                    <el-tag size='small' @click="reason(item.reason)" v-if="item.status==-1" type="danger">
                      <i >
                        审核失败
                      </i>
                    </el-tag>
                  </el-tooltip>
                </div>
                <div style="margin-left:20px">
                  <el-button size='mini' type="danger" class="button" @click="delCart(item.goods_id,item.status)">下线车辆</el-button>
                  <el-button v-if="item.status!=1" size='mini' type="warning" class="button" @click="editCart(item.goods_id)">修改信息</el-button>
                </div> 
              </div>
            </div>
          </div>
          <el-dialog
            title="下线原因"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">
            <el-radio-group v-model="choosere">
              <el-radio label="不想卖了"></el-radio>
              <el-radio v-if="status==1" label="已卖出"></el-radio>
              <el-radio label="其他"></el-radio>
            </el-radio-group>
            <div class="price" v-if="this.choosere=='已卖出'">
              <label for="">卖出价格：</label>
              <el-input class="price-input" v-model="price"></el-input>
              <i>
                万元
              </i>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="delreason">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <div v-loading="loading" style="padding:50px" element-loading-text="加载中..." v-else>
          <div class="publish-e">
          </div>
          <p style="text-align: center;padding: 20px;color: #8d8d8d">无发布信息</p>
          <div style="text-align: center">
            <router-link to="/addgood">
              <el-button style="width: 150px;height: 40px;" type='warning'>现在去发布</el-button>
            </router-link>
          </div>
        </div>
      </div>
    </y-shelf>
  </div>
</template>
<script>
  import YShelf from '../../../components/Shelf'
  import {getgoodbyuser,delgood} from '../../../api/index'
  import { getStore } from '../../../utils/storage'
  export default {
    data () {
      return {
       dialogVisible:false,
       userName:'',
       goodlist:'',
       choosere:'',
       price:'',
       id:'',
       status:''
      }
    },
    methods: {
      cancel(){
        this.dialogVisible = false;
        this.choosere='';
        this.status='';
      },
      message (m) {
        this.$message.error({
          message: m
        })
      },
      _getOrderDet(){
        var params={
          userName:this.userName
        }
        getgoodbyuser(params).then(res=>{
          if(res.code==200){
            this.goodlist=res.data;
          }
        })
      },
      reason(reason){
        this.$alert(reason, '审核失败原因', {
          confirmButtonText: '确定',
        });
      },
      editCart(id){
        window.open(window.location.origin + '#/addgood?goods_id=' + id)
      },
      delCart(id,status){
        this.dialogVisible=true;
        this.id=id
        this.status=status
      },
      delreason(){
        if(!this.choosere){
           this.$message.error('请选择下线原因');
           return false;
        }
        var params={
          goods_id:this.id,
          del_reason:this.choosere,
          market_price:this.price
        }
        delgood(params).then(res=>{
          if(res.code==200){
            this.dialogVisible=false;
            this.$message({
              type:'success',
              message:'车辆已下架'
            })
            this.choosere='';
            this.status='';
          }
        })
      }
    },
    created () {
      this.userName = getStore('userName')
      this._getOrderDet()
    },
    components: {
      YShelf,
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/style/mixin";

  .orderStatus {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin: 50px -150px 20px 60px;
     /deep/ .el-step__head{
    width:200px;
  }
  }
  .el-title{
    width:200px;
  
  }
  .good{
    display: flex;
    margin:50px 100px;
  }

  .image{
    width:300px;
    height:200px;
    img{
      width:300px;
      height:200px;
    }
  }
  .right{
    margin-left:20px;
    .brand{
    margin:10px;
    font-size:22px
    }
    .second{
      display: flex;
      padding: 10px;
      color:silver;
      div{
        padding: 10px;
      }
    }
    .button{
      margin:10px 10px 0 0;
      width:180px;
    }
  }

  .el-tag{
    cursor: pointer;
  }
  .price{
    margin:20px;
    .price-input{
      width: 100px;
      margin-left: 10px;
    }
  }
  .publish-e {
    margin: 0 auto;
    background: url("./../../../../static/images/error.png") no-repeat;
    width: 400px;
    height: 200px;
    color: #8d8d8d;
  }
</style>
