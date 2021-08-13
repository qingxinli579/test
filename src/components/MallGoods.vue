<template>
  <el-row class="good-item">
    <el-col>
      <el-card :body-style="{padding: 0}" style="height:320px">
        <div class="good-img">
          <a>
            <img :src="goods.goods_picture.split('#')[0]" alt>
          </a>
        </div>
        <h6 class="good-title">
          <el-tag v-if="goods.urgent=='否'" size="mini" type="danger">急售</el-tag>
          {{ goods.brand }}  {{ goods.firstTime }}款 {{ goods.color }}  </h6>
        <h3 class="sub-title ellipsis">{{ goods.mile }}万公里/{{ goods.address }}</h3>
        <div class="good-price pr">
          <div class="ds pa">
            <a href="javascript:;">
              <el-button type="default" size="medium" @click="productDetail(goods.goods_id)">查看详情</el-button>
            </a>
            <a href="javascript:;">
              <el-button
                type="primary"
                size="medium"
                @click="add(goods.goods_id,goods.price,goods.brand,goods.goods_picture)"
              >加入收藏夹</el-button>
            </a>
          </div>
          <p>
            <span style="font-size:14px">¥</span>
            {{ Number(goods.price) }}万
          </p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import { addcollect } from '../api/index'
import { mapState, mapMutations } from 'vuex'
import { getStore } from '../utils/storage'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['goods'],
  data() {
    return {
      address: '',
      userName: ''
    }
  },
  computed: {
    ...mapState(['login'])
  },
  methods: {
    ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
    productDetail(id) {
      window.open(window.location.origin + '#/goodDetail?goods_id=' + id)
    },
    add(goods_id, price, brand, goods_picture) {
      var params = {
        userName: this.userName,
        goods_id
      }
      addcollect(params).then(res => {
        if (res.code == 200) {
          this.ADD_CART({
            goods_id,
            price,
            brand,
            goods_picture
          })
          this.$message({
            type: 'success',
            message: '添加成功'
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          })
        }
      })
    }
  },
  // eslint-disable-next-line vue/order-in-components
  created() {
    this.userName = getStore('userName')
  }
}
</script>

<style lang="scss" scoped>
.good-img {
  display: flex;
  justify-content: center;
  a {
    display: block;
    img {
      margin: 0px auto 10px;
      width: 100%;
      height: 180px;
      display: block;
    }
  }
}
.good-price {
  margin: 15px 0;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #d44d44;
  font-family: Arial;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  justify-content: space-around;
  padding-bottom: 60px;
  a {
    margin-right: 5px;
  }
  .ds {
    display: none;
  }
}
.good-price:hover .ds {
  display: block;
}
.good-title {
  line-height: 1.2;
  font-size: 16px;
  color: #424242;
  margin: 0 auto;
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
  width: 23%;
  transition: all 0.5s;
  height: 320px;
  margin:10px 1%;
  box-sizing: border-box;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 1px 1px 20px #999;
    .good-price p {
      display: none;
    }
    .ds {
      display: flex;
    }
  }
}
.el-card {
  border: none;
}
</style>
