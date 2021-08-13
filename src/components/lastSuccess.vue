<template>

  <el-row class="item">
    <el-col @click="productDetail(goods.goods_id)">
      <div class="img">
        <a href="">
          <img :src="goods.goods_picture.split('#')[0]" alt>
        </a>
      </div>
      <div class="text">
        <div class="text-center">
          <p class="text-top">
            {{ goods.brand }}
          </p>
          <div class="text-midle" />
          <p class="text-bottom">
            成交价格：￥{{ goods.market_price }}
          </p>
        </div>

      </div>
    </el-col>
  </el-row>

</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getStore } from '@/utils/storage'
export default {
  props: ['goods'],
  computed: {
    ...mapState(['login'])
  },
  methods: {
    ...mapMutations(['ADDCART']),
    productDetail(id) {
      window.open(window.location.origin + '#/goodDetail?goods_id=' + id)
    },
    addCart(id, price, name, img) {
      if (this.login) {
        // 用户已登录
        this.$http.post('/api/addCart', {
          userId: getStore('id'),
          productId: id,
          productNum: 1
        })
        // 已经存储到后端中， 将当前的商品存储到store的cartList
        this.ADDCART({
          productId: id,
          salePrice: price,
          productName: name,
          productImageBig: img
        })
      } else {
        // 如果用户未登录 也要将商品存储到store的cartList
        this.ADDCART({
          productId: id,
          salePrice: price,
          productName: name,
          productImageBig: img
        })
      }
    }
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
.item{
    background: #fff;
  width: 31.3%;
  transition: all 0.5s;
  height: 220px;
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
    .img{
        display: flex;
  justify-content: center;
  a {
    display: block;
    img {
      margin: 0px auto 10px;
      width: 100%;
      height: 220px;
      display: block;
      background: lemonchiffon;
    }

    }
    }
    .text{
        position: absolute;
        top:0;
        left:0;
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,0.3);
        .text-center{
            position: absolute;
            top:50%;
            left:50%;
            transform: translate(-50%,-50%);
            color:#fff;

            .text-top{
                font-size: 22px;
                text-align: center;
            }
            .text-midle{
                height: 4px;
                width: 100px;
                background: #fff;
                margin:10px auto;
            }
            .text-bottom{
                font-size: 20px;
                color:orange;
                text-align: center;
            }
        }
    }
</style>
