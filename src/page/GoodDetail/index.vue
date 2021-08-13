<!--商品详情-->
<template>
  <div class="w store-content">
    <div class="gray">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumbnail">
            <ul>
              <li v-for="(item,i) in small" :key="i" :class="{on:big===item}" @mouseenter="big=item">
                <img v-lazy="item" :alt="product.brand">
              </li>
            </ul>
          </div>
          <div class="thumb">
            <div class="big">
              <el-image
                style="width: 200px; height: 80px"
                :src="big"
                :preview-src-list="small"
              />
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
          <h4>{{ product.brand }}</h4>
          <div>
            <el-tooltip placement="top">
              <div slot="content">车辆过户次数为0</div>
              <el-tag v-if="product.guohu!==0" size="mini" type="danger" style="margin-right:5px">0次过户</el-tag>
            </el-tooltip>

            <el-tag v-if="product.urgent" size="mini" type="danger">急售</el-tag>
          </div>
          <div class="title">
            <div class="title-info">
              <p class="info-top">{{ product.color }}</p>
              <p class="info-bottom">车辆颜色</p>
            </div>
            <div class="title-line" />
            <div class="title-info">
              <p class="info-top">{{ product.address }}</p>
              <p class="info-bottom">车辆地址</p>
            </div>
            <div class="title-line" />
            <div class="title-info">
              <p class="info-top">{{ product.mile }}万公里</p>
              <p class="info-bottom">行驶里程</p>
            </div>
          </div>
        </div>
        <div class="price">
          <em>¥</em><i class="price-num">{{ product.price }} 万</i>
          <el-popover
            placement="right"
            width="200"
            trigger="hover"
            content="看车前请谨慎付定金、押金，请实地看车，查验购买车辆相关证件"
          >
            <span slot="reference" class="warning">
              <i class="el-icon-warning-outline" />
              风险提醒
            </span>
          </el-popover>
        </div>
        <div class="info">
          <el-alert
            title="该车源人工审核车源真实性，请放心购买"
            type="warning"
            :closable="false"
          />
        </div>
        <div class="buy">
          <el-button
            type="warning"
            style="width: 145px;height: 50px;"
            @click="add(product.goods_id,product.price,product.brand,product.goods_picture)"
          >
            加入收藏夹
          </el-button>
          <el-button
            style="width: 145px;height: 50px;margin-left: 10px"
            @click="preview"
          >
            {{ text }}
          </el-button>
        </div>
      </div>
    </div>
    <!--产品信息-->
    <div class="item-info">
      <div class="w">
        <div class="user">个人信息</div>
        <el-row>
          <el-col :span="8"><div>
            联系人：{{ product.name }}
          </div></el-col>
          <el-col :span="8"><div>
            看车地址：{{ product.address }}
          </div></el-col>
          <el-col :span="8"><div>
            是否急售：{{ product.urgent }}
          </div></el-col>
        </el-row>
        <div class="cars" style="margin-top:15px">车辆信息</div>
        <el-row>
          <el-col v-if="product.vin" :span="12"><div>
            车辆识别代号：{{ product.vin }}
          </div></el-col>
          <el-col :span="12"><div>
            品牌：{{ product.brand }}
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><div>
            车辆颜色：{{ product.color }}
          </div></el-col>
          <el-col :span="12"><div>
            首次上牌时间：{{ product.firstTime }}
          </div></el-col>

        </el-row>
        <el-row>
          <el-col :span="12"><div>
            行驶里程：{{ product.mile }}万公里
          </div></el-col>
          <el-col :span="12"><div>
            转让价格：{{ product.price }}万元
          </div></el-col>
        </el-row>
        <div v-if="product.decrip">
          <div class="topic">车况描述：</div>
          <div class="topic">
            {{ product.decrip }}
          </div>
        </div>
        <div class="topic">图片：</div>
        <div v-for="(item,i) in small" :key="i" class="topic" style="width:100%">
          <img v-lazy="item" style="width:100%" :alt="product.brand">
        </div>
        <div class="more" style="margin-top:15px">更多信息</div>
        <el-row>
          <el-col :span="8"><div>
            年检到期：{{ product.checkYear }}
            <i v-if="product.checkYear!='未检'">年</i>
          </div></el-col>
          <el-col :span="8"><div>
            交强险到期：{{ product.traffic }}
            <i v-if="product.traffic!='过保'">年</i>
          </div></el-col>
          <el-col :span="8"><div>
            商业险到期：{{ product.insurance }}
            <i v-if="product.insurance!='无商业险'">年</i>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col v-if="product.times" :span="8"><div>
            过户次数：{{ product.times }}次
          </div></el-col>
          <el-col v-if="product.diya" :span="8"><div>
            车辆是否有抵押：{{ product.diya }}
          </div></el-col>
          <el-col v-if="product.baoyang" :span="8"><div>
            是否定期4S店保养：{{ product.baoyang }}
          </div></el-col>
        </el-row>
        <div v-if="product.hightlight">
          <div class="topic">车辆亮点：</div>
          <div>{{ product.hightlight }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { addcollect } from '../../api/index'
import { mapMutations } from 'vuex'
import { getgoodByid } from '../../api/index'
export default {
  data() {
    return {
      text: '查看电话',
      productMsg: {},
      small: [],
      big: '',
      product: {
        salePrice: 0
      },
      userName: ''
    }
  },
  methods: {
    ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
    _productDet(goods_id) {
      var params = { goods_id }
      getgoodByid(params).then(res => {
        this.product = res.data[0]
        var result = this.product.goods_picture
        var picture = result.split('#')
        this.small = picture
        this.big = picture[0]
      })
    },
    preview() {
      this.text = this.product.phone
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
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/style/mixin";
  .store-content {
    clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 100px 0 25px;
    margin: 0 auto;
  }
  .gray {
    display: flex;
    padding: 60px;
    margin-bottom: 20px;
    .gallery-wrapper {
      .gallery {
        display: flex;
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #f0f0f0;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid #ccc;
              border: 3px solid rgba(0, 0, 0, .2);
            }
            img {
              display: block;
              @include wh(100%);
            }
          }
        }
        .thumb {
          .big {
            margin-left: 20px;
          }
          /deep/ .el-image{
            display: block;
            height:350px !important;
            width: 480px !important;
          }
        }
      }
    }
    // 右边
    .banner {
      width: 450px;
      margin-left: 10px;
      .info{
        margin-top:20px;
      }
      h4 {
        font-size: 26px;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
        .title{
          display:flex;
          .title-info{
          padding:20px;
          .info-top{
            font-size:18px;
            padding-bottom: 10px;
          }
          .info-bottom{
            font-size:12px;
            text-align: center;
          }
        }
        .title-line{
          height:40px;
          width:1px;
          background:#ccc;
          margin-top:25px;
        }
        }
      }
      .buy {
        position: relative;
        padding: 30px 0 0 10px;
      }
    }
  }

  .item-info {

    .gray {
      padding: 0;
      display: block;
    }
    .img-item {
      width: 1220px;
      // padding: 1vw;
      text-align: center;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 22px;
    line-height: 20px;
    padding-left:20px;
    .price-num {
      padding-left: 2px;
      font-size: 28px;
    }
    .warning{
      font-size:12px;
      margin-left:20px;
      color:#000;
      font-weight: 300;
    }
  }

  .el-row {
    margin:30px;

  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  body{
  background:rgb(240, 240, 240);

  }
  .user, .cars,.more, .verify{
    height: 40px;
    border-bottom:1px solid ;
    background-color: #fff;
    margin-bottom: 5px;
    font-size: 22px;
    padding-left:20px;
    padding-top: 8px;
  }
  .container{
      width: 900px;
      margin: 20px auto;
  }
  .topic{
    margin:30px;
  }
</style>
