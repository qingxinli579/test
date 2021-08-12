<template>
  <div class="goods">
    <div class="box-card">
      <div class="nav">
        <div>
          <div class="icon">
            <el-row>
              <el-col :span="2">
                品牌：
              </el-col>
              <el-col 
                v-for="item in cart" 
                :span="2"
                :key="item.brand_name"
              >
                <div @click="insert(item.brand_name)">
                  <div  style="float:left">
                      <img class="bg-purple" :src=item.brand_logo alt="">
                  </div>
                  <div >
                      {{item.brand_name}}
                  </div>
                </div>
              </el-col>
              <el-col :span="2">
                <div class="more" style="height:20px;">
                  <el-select clearable class="all" v-model="brand" @change="_getAllGoods" filterable placeholder="查看更多">
                    <el-option-group
                      v-for="group in brandOptions"
                      :key="group.label"
                      :label="group.label">
                      <div style="display:flex;flex-wrap: wrap; width:1200px;margin:0 auto;">
                        <el-option
                          v-for="item in group.options"
                          :key="item.value"
                          :value="item.value">
                          <div>
                            <img :src=item.brand_logo alt="" class="logo">
                            {{item.value}}
                          </div>
                        </el-option>
                      </div>
                    </el-option-group>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="price">
            <a>价格：</a>
            <a href="javascript:;" :class="{active:sortType===1}" @click="reset()">综合排序</a>
            <a href="javascript:;" @click="sortByPrice(1)" :class="{active:sortType===2}">价格从低到高</a>
            <a href="javascript:;" @click="sortByPrice(-1)" :class="{active:sortType===3}">价格从高到低</a>
            <div class="price-interval">
              <input type="number" class="input" placeholder="价格" v-model="min">
              <span style="margin: 0 5px"> - </span>
              <input type="number" placeholder="价格" v-model="max">
              <el-button type="warning" size="mini" @click="reset" style="margin-left: 10px;">
                确定
              </el-button>
            </div>
          </div>
          <div class="other">
            <div>其他：</div>
            <div class="selcolor">
              <el-select clearable v-model="ruleForm.color" @change='_getAllGoods' placeholder="颜色">
                <el-option
                  v-for="item in color"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.lable">
                  
                  <div style="float: left; color: #8492a6; font-size: 13px">{{ item.lable }}</div>
                </el-option>
              </el-select>
            </div>
            <div class="selmile">
              <el-select clearable v-model="ruleForm.mile" @change='_getAllGoods' placeholder="行驶里程">
                  <el-option
                    v-for="item in mile"
                    :key="item.value"
                    :label="item.lable"
                    :value="item.value">
                  </el-option>
              </el-select>
            </div>
            <div class="selyear">
              <el-select clearable v-model="ruleForm.year" @change='_getAllGoods' placeholder="上牌时间">
                  <el-option
                    v-for="item in year"
                    :key="item.value"
                    :label="item.lable"
                    :value="item.value">
                    <div style="float: left; color: #8492a6; font-size: 13px">{{ item.lable }}</div>
                  </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-loading="loading" element-loading-text="加载中..." style="min-height: 35vw;">
      <div class="img-item" v-if="!noResult">
        <!--商品-->
        <div class="goods-box w">
          <mall-goods v-for="(item,i) in goods" :key="i" :goods="item"></mall-goods>
        </div>
        <el-pagination
          v-if="!noResult&&!error"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[4, 12, 40, 80]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <div class="no-info" v-if="noResult">
        <div class="no-data">
          <img src="../../../static/images/no-search.png">
          <br> 抱歉！暂时还没有商品
        </div>
        <!-- <section class="section">
          <y-shelf :title="recommendPanel.name">
            <div slot="content" class="recommend">
              <mall-goods :msg="item" v-for="(item,i) in recommendPanel.panelContents" :key="i"></mall-goods>
            </div>
          </y-shelf>
        </section> -->
      </div>
      <div class="no-info" v-if="error">
        <div class="no-data">
          <img src="../../../static/images/error.png">
          <br> 抱歉！出错了...
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import goods from '../../serve/goods.json'
  import {getGoodsinfo} from '../../api/index'
  import mallGoods from '../../components/MallGoods'
  import {cartjson} from '../../serve/cart'
import cartjsons from '../../serve/firstCart.json';
  export default {
    data () {
      return {
        search:'',
        mile:[
          {
            "lable":"1万公里以内",
            "value":'1'
          },
          {
            "lable":"3万公里以内",
            "value":'3'
          },
          {
            "lable":'6万公里以内',
            "value":'6'
          },
          {
            "lable":'10万公里以内',
            "value":'10'
          }
        ],
        year:[
          {
            lable:'1年以内',
            value:'1'
          },
          {
            lable:'3年以内',
            value:'3'
          },
          {
            lable:'6年以内',
            value:'6'
          },
          {
            lable:'10年以内',
            value:'10'
          },
          {
            lable:'10年以上',
            value:'11'
          },
        ],
        ruleForm:{
          color:'',
          mile:'',
          year:''
        },
        color:goods.color,
        brandOptions:[],
        cart:cartjsons.cart,
        goods: [],
        noResult: false,
        error: false,
        min: '',
        max: '',
        loading: true,
        timer: null,
        sortType: 1,
        windowHeight: null,
        windowWidth: null,
        sort: '',
        currentPage: 1,
        total: 0,
        pageSize: 12,
        brand:this.$route.params.brand
      }
    },
    methods: {
      handleSizeChange (val) {
        this.pageSize = val
        this._getAllGoods()
        this.loading = true
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this._getAllGoods()
        this.loading = true
      },
      _getAllGoods () {
        if (this.min !== '') {
          this.min = Math.floor(this.min)
        }
        if (this.max !== '') {
          this.max = Math.floor(this.max)
        }
        let params = {
            currentPage: this.currentPage,
            size: this.pageSize,
            sort: this.sort,
            pricemin: this.min,
            pricemax: this.max,
            brand:this.brand,
            color:this.ruleForm.color,
            mile:this.ruleForm.mile,
            year:this.ruleForm.year,
            search:this.search
          }
        
        getGoodsinfo(params).then(res => {
          if (res.code === 200) {
            this.total = res.total
            this.goods = res.data
            this.noResult = false
            if (this.total === 0) {
              this.noResult = true
            }
            this.error = false
          } else {
            this.error = true
          }
          this.loading = false
        })
      },
      // 默认排序
      reset () {
        this.sortType = 1
        this.sort = ''
        this.currentPage = 1
        this.loading = true
        this._getAllGoods()
      },
      // 价格排序
      sortByPrice (v) {
        v === 1 ? this.sortType = 2 : this.sortType = 3
        this.sort = v
        this.currentPage = 1
        this.loading = true
        this._getAllGoods()
      },
      insert(brand){
        this.brand=brand;
        this._getAllGoods()
      }
    },
    watch: {
       $route(){    
         if(this.search!= this.$route.query.key){
           this.search= this.$route.query.key
           this._getAllGoods()
         }
        
      }
    },
    created () {
      var n=cartjson();
      this.brandOptions=n;
      if(this.$route.query.key){
        this.search=this.$route.query.key
      } 
      this._getAllGoods()
    },
    mounted () {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
    },
    components: {
      mallGoods,
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/style/mixin";
  @import "../../assets/style/theme";
  .goods{
    padding-top:70px;
  }
  .nav {
    padding: 5px 20px;
    .icon{
        width: 850px;
        margin: 15px ;
        font-size: 14px;
        color: rgb(131, 126, 126);
        .bg-purple{
          width:20px;
          height:20px;
        }
        .more{
          position: relative;
          top: -20px;
          color: orange;
          cursor: pointer;
        }
     }
    .price {
      display: flex;
      align-items: center;
      a {
        padding: 0 15px;
        height: 100%;
        @extend %block-center;
        font-size: 14px;
        color: rgb(131, 126, 126);
        &.active {
          color: #5683EA;
        }
        &:hover {
          color: #5683EA;
        }
      }
      input {
        @include wh(80px, 30px);
        border: 1px solid #ccc;
      }
      input + input {
        margin-left: 10px;
      }
    }
    .price-interval {
      padding: 0 15px;
      @extend %block-center;
      input[type=number] {
        border: 1px solid #ccc;
        text-align: center;
        background: none;
        border-radius: 5px;
      }
    }
  }

  .goods-box {
    > div {
      float: left;
      border: 1px solid #efefef;
    }
  }

  .no-info {
    padding: 100px 0;
    text-align: center;
    font-size: 30px;
    display: flex;
    flex-direction: column;
    .no-data{
      align-self: center;
    }
  }

  .img-item{
    display: flex;
    flex-direction: column;
  }

  .el-pagination{
    align-self: flex-end;
    margin: 3vw 10vw 2vw;
  }

  .section {
    padding-top: 8vw;
    margin-bottom: -5vw;
    width: 1218px;
    align-self: center;
  }

  .recommend {
    display: flex;
    > div {
      flex: 1;
      width: 25%;
    }
  }

 .logo{
      width:20px;
      height:20px;
      position: relative;
      top:5px;
  }
  .other{
    display: flex;
    align-items: center;
    margin-left:15px;
    font-size: 14px;
    color: rgb(131, 126, 126);
  }
  .more,.selcolor,.selmile,.selyear{
    padding: 10px 15px;
    /deep/ .el-input__inner{
        position: inherit;
        border:none;
        font-size: 14px;
        color: rgb(131, 126, 126);
    }
    /deep/ .el-input{
      width:80px;
    }
    .input-text{
        
        position: absolute;
        right:15px;
        top:0;
    }
  }
  .selmile /deep/ .el-input{
      width:120px;
    }
 .selyear /deep/ .el-input{
      width:120px;
    }
  .all /deep/ .el-input{
   width:120px;
}
  .box-card{
    width: 92%;
    margin:0 auto;  
    border: 1px solid #eee;
  }
  .el-col >div{
    cursor: pointer;
  }
</style>
