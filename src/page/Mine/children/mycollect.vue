<template>
  <div class="shopping-cart">
    <div class="store-content page-cart">
      <div class="gray-box">
        <div class="title"><h2>收藏夹</h2></div>
        <!--内容-->
        <div v-if="cartList.length" class="content">
          <el-table
            ref="multipleTable"
            :data="cartList"
            tooltip-effect="dark"
            style="width:100%;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              show-overflow-tooltip
              width="55"
            />
            <el-table-column
              label="商品信息"
              width="300"
            >
              <template slot-scope="scope">
                <div class="items-thumb fl">
                  <img
                    :alt="scope.row.brand"
                    :src="scope.row.goods_picture.split('#')[0]"
                  >
                  <a :title="scope.row.goods_picture" target="_blank" @click="goodsDetails(scope.row.goods_id)" />
                </div>
                <div class="name hide-row fl">
                  <div class="name-table">
                    <a
                      :title="scope.row.brand"
                      target="_blank"
                      @click="goodsDetails(scope.row.goods_id)"
                      v-text="scope.row.brand"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              width="200"
            >
              <template slot-scope="scope">
                <div class="price1">¥ {{ scope.row.price }}万元</div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="left"
            >
              <template slot-scope="scope">
                <div class="operation">
                  <a class="items-delete-btn" @click="cartdel(scope.row.goods_id)" />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="cart-bottom-bg fix-bottom">
            <div class="fix-bottom-inner">
              <div class="cart-bar-operation">
                <div>
                  <el-button size="mini" type="warning" @click="delChecked">删除选中的商品</el-button>
                </div>
              </div>
              <div class="shipping">
                <div class="shipping-box">
                  <div class="shipping-total shipping-num">
                    <h4
                      class="highlight"
                    >已选择
                      <i v-text="multipleSelection.length" />
                      件商品</h4>
                    <h5>共计 <i v-text="totalNum" /> 件商品</h5></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else style="padding:50px">
          <div class="cart-e" />
          <p style="text-align: center;padding: 20px;color: #8d8d8d">你的收藏夹空空如也</p>
          <div style="text-align: center">
            <router-link to="/goods">
              <el-button style="width: 150px;height: 40px;" type="warning">现在去选购</el-button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { delcollect, delcollects } from '../../../api/index'
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      userName: 0,
      submit: true,
      multipleSelection: []
    }
  },
  computed: {
    ...mapState(
      ['cartList']
    ),
    // 计算总数量
    totalNum() {
      var totalNum = this.cartList.length
      return totalNum
    }
  },
  methods: {
    ...mapMutations([
      'INIT_BUYCART', 'EDIT_CART'
    ]),
    message(m) {
      this.$message.error({
        message: m
      })
    },
    goodsDetails(id) {
      window.open(window.location.origin + '#/goodDetail?goods_id=' + id)
    },
    // 删除整条购物车
    cartdel(goods_id) {
      this.$confirm('确定要删除该收藏?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          userName: this.userName,
          goods_id
        }
        delcollect(params).then(() => {
          this.EDIT_CART({ goods_id })
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    delChecked() {
      this.$confirm('确定要删除该收藏?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var multipleSelection = this.multipleSelection
        var params = {
          userName: this.userName,
          multipleSelection
        }
        delcollects(params).then(res => {
          if (res.code == 200) {
            for (var i = 0; i < multipleSelection.length; i++) {
              this.EDIT_CART({ goods_id: multipleSelection[i].goods_id })
            }
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.message('删除失败')
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .store-content {
    clear: both;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
    .gray-box {
      position: relative;
      margin-bottom: 30px;
      overflow: hidden;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #dcdcdc;
      border-color: rgba(0, 0, 0, .14);
      box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);
      .title {
        padding-left: 30px;
        position: relative;
        z-index: 10;
        height: 60px;
        padding: 0 10px 0 24px;
        border-bottom: 1px solid #d4d4d4;
        border-radius: 8px 8px 0 0;
        box-shadow: rgba(0, 0, 0, .06) 0 1px 7px;
        background: #f3f3f3;
        background: -webkit-linear-gradient(#fbfbfb, #ececec);
        background: linear-gradient(#fbfbfb, #ececec);
        line-height: 60px;
        font-size: 18px;
        color: #333;
      }
    }
    .ui-cart {
      padding-bottom: 91px;
      .cart-table-title {
        position: relative;
        z-index: 1;
        line-height: 38px;
        height: 38px;
        padding: 0 0 0 30px;
        font-size: 12px;
        background: #eee;
        border-bottom: 1px solid #dbdbdb;
        border-bottom-color: rgba(0, 0, 0, .08);

        span {
          width: 137px;
          float: right;
          text-align: center;
          color: #838383;
        }
      }
      .cart-group.divide {
        .cart-items {
          border-top: 1px dashed #eee;
        }
      }
      .cart-items {
        position: relative;
        height: 140px;
        margin-left: 74px;
        /*删除*/

        .item-cols-num,
        .operation,
        .price1 {
          overflow: hidden;
          float: right;
          width: 137px;
          text-align: center;
          color: #666;
          line-height: 140px;
        }
      }
      .cart-group.divide .cart-top-items:first-child .cart-items {
        border-top: none;
      }
      .items-choose {
        position: absolute;
        left: -74px;
        top: 0;
        width: 74px;
        height: 20px;
        padding: 60px 0 0 31px;
        font-size: 12px;
        color: #999;
      }

      .cart-items .items-thumb > a, .ui-cart .cart-items .items-thumb > i {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border: 1px solid #fff;
        border-radius: 3px;
        border: 0 solid rgba(255, 255, 255, .1);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
      }
      .name {
        width: 380px;
        margin-left: 20px;
        color: #323232;
        display: table;
        a {
          color: #333;
          font-size: 16px;
        }
      }

      .attribute, .name p {
        color: #999;
        font-size: 12px;
        padding-top: 4px;
        line-height: 17px;
      }

    }

  }

  .page-cart {
    .fix-bottom {
      height: 90px;
      width: 100%;
      position: absolute;
      bottom: 0;
      z-index: 1;
      background-position: center;
      background: #fdfdfd;
      background: -webkit-linear-gradient(#fdfdfd, #f9f9f9);
      background: linear-gradient(#fdfdfd, #f9f9f9);
      border-top: 1px solid #e9e9e9;
      box-shadow: 0 -3px 8px rgba(0, 0, 0, .04);
      .cart-bottom-bg {
        height: 80px;
        border-top: 1px solid #D9D9D9;
        border-radius: 0 0 8px 8px;
      }
    }
    .cart-bar-operation {
      float: left;
      padding: 35px 26px;
      font-size: 12px;
    }
    .blue-checkbox-new {
      float: left;
      margin-right: 9px;
    }
    .choose-all, .delete-choose-goods, .selected-count {
      float: left;
      height: 20px;
      line-height: 20px;
      cursor: pointer;
      position: relative;
    }
    .blue-checkbox-new, .blue-checkbox-new.checkbox-disable, .blue-checkbox-new.checkbox-on {
      display: inline-block;
      position: relative;
      width: 20px;
      height: 20px;
      background: url(./../../../../static/images/checkbox-new_631a56a4f6.png) no-repeat 0 -20px;
      cursor: pointer;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      vertical-align: middle;
    }

    .blue-checkbox-new.checkbox-on, .choose-checkbox-on .blue-checkbox-new {
      background: url(./../../../../static/images/checkbox-new_631a56a4f6.png) no-repeat 0 0;
    }
    .delete-choose-goods {
      position: relative;
      margin-left: 21px;
      color: #bbb;
    }
    .shipping {
      float: right;
      padding: 20px 30px;
    }
    .shipping-box {
      display: inline-block;
      padding-top: 1px;
      margin-right: 10px;
    }
    .shipping-total {
      display: inline-block;
      border-left: 1px solid #e1e1e1;
      padding: 0 20px;
      &.shipping-num i {
        width: 28px;
        display: inline-block;
        text-align: center;
      }
      h4 {
        color: #323232;
        > i {
          font-size: 18px;
          font-weight: 700;
        }
        i, span {
          color: #d44d44;
        }

      }
      h5 {
        color: #959595;
        > i {
          font-size: 16px;
          font-weight: 700;
        }
      }

    }

    .shipping-total.shipping-num {
      text-align: right;
    }
    .shipping-total:first-child {
      border: none;
    }
  }

  .cart-e {
    margin: 0 auto;
    background: url("./../../../../static/images/error.png") no-repeat;
    width: 400px;
    height: 200px;
    color: #8d8d8d;
  }
 .items-thumb {
    position: relative;
    margin-top: 30px;
    overflow: hidden;
    width: 120px;
    height: 80px;
  }
  img {
    width: 120px;
    height: 80px;
  }
  .name {
    float: left;
    text-align: left;
  }
  .name-table {
    display: table-cell;
    vertical-align: middle;
    height: 140px;
    padding-left: 20px;
  }
  .operation {
    font-size: 12px;
    line-height: 24px;
    .items-delete-btn {
      background-image: url(./../../../../static/images/delete-btn-icon_a35bf2437e@2x.jpg);
      &:hover {
        background-position: 0 -36px;
      }
    }
    .items-delete-btn {
      display: block;
      width: 24px;
      height: 24px;;
      color: #C2C2C2;
      background: url(./../../../../static/images/delete-btn-icon_a35bf2437e@2x.jpg);
      -webkit-background-size: 100% auto;
      background-size: 100% auto;
      -moz-transition: none;
      -webkit-transition: none;
      -o-transition: none;
      transition: none;
    }
  }
  .content{
    margin-bottom: 100px;
  }
</style>
