<template>
  <el-row class="good-item">
    <el-col :span="12">
        <div class="good-img">
          <a>
            <img :src="goods.goods_picture.split('#')[0]"  alt>
          </a>
        </div>
    </el-col>
    <el-col :span="12">
        <div style="margin:25px  15px 0 0;">
            <h6 class="good-title">
                <el-tag size="mini" v-if="goods.urgent=='否'" type="danger">急售</el-tag>
                {{goods.brand}}  {{goods.firstTime}}款 {{goods.color}}  </h6>
            <h3 class="sub-title ellipsis">{{goods.mile}}万公里/{{goods.address}}</h3>
            <div class="good-price">
                <div class="ds">
                    <a>
                    <el-button type="default" size="mini" @click="productDetail(goods.goods_id)">查看详情</el-button>
                    </a>
                    <a>
                    <el-button
                        type="primary"
                        size="mini"
                        @click="add(goods.goods_id,goods.price,goods.brand,goods.goods_picture)"
                    >收藏</el-button>
                    </a>
                </div>
                <p>
                    <span style="font-size:14px">¥</span>
                    {{Number(goods.price)}}万
                </p>
            </div>
        </div>
    </el-col>
  </el-row>
</template>
<script>
import {addcollect} from '../api/index'
import { mapState,mapMutations } from "vuex";
import { getStore } from "../utils/storage";
export default {
  data(){
    return{
      address:'',
      userName:''
    }
  },
  props: ["goods"],
  computed: {
    ...mapState(["login"])
  },
  methods: {
    ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
    
      productDetail(id) {
      window.open(window.location.origin + '#/goodDetail?goods_id=' + id)
    },
     add(goods_id,price,brand,goods_picture){
        var params={
          userName:this.userName,
          goods_id
        }
        addcollect(params).then(()=>{

          this.ADD_CART({
            goods_id,
            price,
            brand,
            goods_picture
          })
        })
      },
  },
  created(){
    this.userName=getStore('userName')
  }
};
</script>

<style lang="scss" scoped>
.good-img {
//   float: left;
  display: flex;
  justify-content: center;
  a {
    // display: block;
    img {
      margin: 0px auto 10px;
      width: 100%;
      height: 180px;
      display: block;
    }
  }
}
.good-price {
  margin: 15px auto;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #d44d44;
  font-family: Arial;
  font-size: 18px;
  font-weight: 700;
  padding-bottom: 60px;
  a {
    margin-right: 5px;
  }
  .ds {
    display: none;
  }
}
.good-price:hover .ds {
  display: inline-block;
  margin:0 auto;
}
.good-title {
  line-height: 1.2;
  font-size: 16px;
  color: #424242;
  margin: 10px auto;
  padding: 0 14px;
  text-align: center;
  overflow: hidden;
}
h3 {
  text-align: center;
  line-height: 1.2;
  font-size: 12px;
  color: #d0d0d0;
  padding: 10px;
}
.good-item {
  background: #fff;
  width: 46%;
  transition: all 0.5s;
  height: 180px;
  margin-top:10px;
  margin:20px 2%;
  box-sizing: border-box;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 1px 1px 20px #999;
    .good-price p {
      display: none;
    }
    .ds {
      display: inline-block;
      margin:0 auto;
    }
  }
}
.el-card {
  border: none;
}
</style>