<template>
  <div class="home" id="up">
    <div class="banner">
      <el-carousel indicator-position="outside" height="280px">
          <el-carousel-item v-for="item in banner" :key="item">
              <img style="width:100%;height:280px" :src=item.url alt="">
          </el-carousel-item>
      </el-carousel>
      <el-card class="box-card" style="z-index:9999999;">
        <el-col :span="14">
          <div class="grid-content">
            <div class="topic">我要买车 ▶</div>
            <el-row style="margin-left:20px">
              <el-col 
                v-for="item in cart" 
                :span="3"
                :key="item.brand_name"
              >
                <div @click="bybrand(item.brand_name)">
                  <img class="bg-purple" :src=item.brand_logo alt="">
                </div>
                <div>
                  {{item.brand_name}}
                </div>
              </el-col>
            </el-row>
            <el-row class="tuijian">
              <el-col :span="4">
                <a href="#today">今日推荐</a>
              </el-col>
              <el-col :span="4">
                <a href="#new">最新发布</a>
              </el-col>
              <el-col :span="4">
                <a href="#lows">练手车</a>
              </el-col>
              <el-col :span="4">
                <a href="#success">最近成交</a>
              </el-col>
              <el-col :span="4">
              </el-col>
              <el-col :span="4" >
                <router-link to="/goods">
                  <a href=""  style="color:orange">
                    更多车辆>>
                  </a>
                </router-link>    
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple-light">
            <div class="topic">
              我要卖车 ▶
            </div>
            <div class="people">
              已有
              <i style="color:orange;font-size:22px">{{count}}</i>
              人提交了卖车申请
            </div>
            <el-button-group>
              <el-button @click="addgood" class="button" type="danger">填写信息</el-button>
              <a href="#process">
                <el-button class="button" type="warning">
                  交易流程
                </el-button>
              </a>
            </el-button-group>
          </div>
        </el-col>
      </el-card>   
    </div>
    <!-- <div class="amap-page-container" style="height:500px;">
      <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center"> </el-amap>
      <div class="toolbar">
        <span v-if="loaded">
          location: lng = {{ lng }} lat = {{ lat }}
        </span>
        <span v-else>正在定位</span>
      </div>
    </div> -->
    <div style="margin-top:100px">
      <section id="today" class="w mt30 clearfix">
        <m-shelf title="今日推荐">
          <div slot="content" class="floors">
            <div
              class="imgbanner"
            >
            <img :src='todayimg' alt="">
            </div>
            <mall-goods :goods='o' v-for='(o,i) in today' :key='i'></mall-goods>
          </div>
        </m-shelf>
      </section>
      <section class="w mt30 clearfix" id='new'>
        <m-shelf title="最新发布">
          <div slot="content" class="floors">
            <last-goods :goods='o' v-for='(o,i) in topsix' :key='i'></last-goods>
          </div>
        </m-shelf>
      </section>
      <section class="w mt30 clearfix" id='lows'>
        <m-shelf title="练手车"  style="postion:reletive" >
          <div slot="content" class="floors">
            <div 
              style="float:right;overflow:hidden"
              class="imgbanner"
            >
              <img  :src="proimg" alt="">
            </div>
            <mall-goods  :goods='o' v-for='(o,i) in practise' :key='i'></mall-goods> 
          </div>
        </m-shelf>
      </section>
      <section class="w mt30 clearfix" id='success'>
        <m-shelf title="最近成交">
          <div slot="content" class="floors">
            <last-success :goods='o' v-for='(o,i) in success ' :key='i'>

            </last-success>
            
          </div>
        </m-shelf>
      </section>
      <section>
        <div class="buy" id='process'>
          <div class="buy-topic">
            <span @mouseover="changebuy" :style="{'border-bottom':isbuy ? '3px solid orange':'none'}"
            class="buy-content">买车流程</span>
            <span>|</span>
            <span @mouseover="changesell" :style="{'border-bottom':!isbuy ? '3px solid orange':'none'}"
            class="buy-content">卖车流程</span>
          </div>
          <div>
            <process v-if="isbuy" :data="buyProcess"></process>
            <process v-if="!isbuy" :data='sellProcess'></process>
          </div>
        </div>
      </section>
      <prompt @changef='changef($event)' :dialogVisible=dialogVisible></prompt>
      <home-side></home-side>
    </div>
    
  </div>
</template>
<script>
  import MShelf from "@/components/Shelf";
  import homeSide from "@/components/homeSide";
  import MallGoods from "@/components/MallGoods";
  import lastGoods from '@/components/lastGoods';
  import lastSuccess from '@/components/lastSuccess';
  import cartjson from '../../serve/firstCart.json';
  import {getCartinfo,getgoodcount,getimg,headgoods} from './../../api/index';
  import Process from '../../components/process.vue';
  import Prompt from '../../components/prompt'
  // 主要逻辑
  export default {
    data() {
      let self = this;
      return {
        topsix:'',
        practise:'',
        success:'',
        today:'',
        dialogVisible:false,
        count:'正在加载',
        isbuy:true,
        buyProcess:[
          {
            lable:'预约看车>>>',
            value:'预约看车',
            value2:'与车主直接联系',
            ico:'el-icon-phone-outline'
          },
          {
            lable:'线下看车>>>',
            value:'线下看车',
            value2:'线下到达指定位置面对面看车',
            img:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2002182095,2757208147&fm=26&gp=0.jpg',
            ico:'el-icon-view'
          },
          {
            lable:'签署合同>>>',
            value:'签署合同',
            value2:'卖方、买方签署二手车买卖及居间服务合同',
            img:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2002182095,2757208147&fm=26&gp=0.jpg',
            ico:'el-icon-edit'
          },
          {
            lable:'交易过户',
            value:'交易过户',
            value2:'协助过户，支付车款，好车开回家',
            ico:'el-icon-truck'
          },
          
        ],
        sellProcess:[
          {
            lable:'填写信息>>>',
            value:'填写信息',
            value2:'填写车辆信息',
            ico:'el-icon-user'
          },
          {
            lable:'审核通过>>>',
            value:'审核通过',
            value2:'管理员进行审核，待审核通过即可在平台发布',
            img:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2002182095,2757208147&fm=26&gp=0.jpg',
            ico:'el-icon-circle-check'
          },
          {
            lable:'用户看车>>>',
            value:'用户看车',
            value2:'快速匹配意向买家',
            img:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2002182095,2757208147&fm=26&gp=0.jpg',
            ico:'el-icon-view'
          },
          {
            lable:'签约过户',
            value:'签约过户',
            value2:'省时省心，支付车款',
            ico:'el-icon-coin'
          },
        ],
        banner:'',
        todayimg:'',
        proimg:'',
        homeList: [],
        gooddetail:'',
        cart:cartjson.cart,
        center: [121.59996, 31.197646],
            lng: 0,
            lat: 0,
            loaded: false,
            plugin: [{
              pName: 'Geolocation',
              events: {
                init(o) {
                    console.log(o,'000')
                  // o 是高德地图定位插件实例
                  o.getCurrentPosition((status, result) => {
                      console.log(result,111)
                    if (result && result.position) {
                      // 如果key是企业的，还可以直接result.addressComponent获取省市，周边等信息
                      self.lng = result.position.lng;
                      self.lat = result.position.lat;
                      console.log(result.position)
                      self.center = [self.lng, self.lat];
                      self.loaded = true;
                      self.$nextTick()
                    }
                  })
                }
              }
                        
            }]
      };
    },
    components: {
      MShelf,
      MallGoods,
      lastGoods,
      lastSuccess,
      Process,
      Prompt,
      homeSide
    },
    methods:{
      changef(){
        this.dialogVisible=false
        console.log(this.dialogVisible)
      },
      changebuy(){
        this.isbuy=true
      },
      changesell(){
        this.isbuy=false
      },
      addgood(){
        this.$router.push({
          path:'/addgood'
        })
      },
      bybrand(name){
        this.$router.push({
            name:'goods',
            params:{
              brand:name
            }
        })
      },
    },
    mounted(){
      if (window.performance.navigation.type == 1) {
        this.dialogVisible=false
        console.log('0')
      }else{
        this.dialogVisible=true
        console.log('1')
      }
    },
    destroyed() {
      window.performance.navigation.type == 1;
      console.log('2')
    },
    created(){
      getCartinfo().then(res=>{
        this.gooddetail=res;
      })
      getgoodcount().then(res=>{
        this.count=res.count
      }),
      getimg({position:'首页轮播'}).then(res=>{
        this.banner=res.data
        console.log(res.data)
      }),
      getimg({position:'今日推荐'}).then(res=>{
        this.todayimg=res.data[0].url
      }),
      getimg({position:'练手车'}).then(res=>{
        this.proimg=res.data[0].url
      }),
      headgoods({type:'1'}).then(res=>{
        this.topsix=res.data
      }),
      headgoods({type:'2'}).then(res=>{
        this.practise=res.data
      }),
      headgoods({type:'3'}).then(res=>{
        this.success=res.data
      }),
      headgoods({type:'0'}).then(res=>{
        this.today=res.data
      })
    }
  };
</script>

<style lang="scss" scoped>
  .home {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 60px;
  }
  .el-carousel__item h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 150px;
      margin: 0;
    }
    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }
    .el-carousel__item:nth-child(2n+1) {
      background-color: #d3dce6;
    }
    .topic{
        font-size: 22px;
        font-weight: 500;
        margin-bottom: 20px;
    }
    .people{
        margin:20px 0 0 20px;
    }
    .tuijian{
        margin:20px 0  0 20px;
        a{
          color:#000
        }
        a:hover{
            color:orange
        }
    }
    
    .bg-purple{
        width:30px;
        height:30px;
    }
    .el-button-group{
        margin:10px 0 0 20px;
        .button{
            width:170px;
            height:50px;
        }
    }
  .no-info {
    padding: 100px 0;
    text-align: center;
    font-size: 30px;
    display: flex;
    flex-direction: column;
    .no-data {
      align-self: center;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .page {
    position: absolute;
    width: 100%;
    top: 470px;
    z-index: 30;
    .dots {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .dot-active {
        display: inline-block;
        width: 15px;
        height: 15px;
        background-color: whitesmoke;
        border-radius: 8px;
        margin-right: 10px;
        cursor: pointer;
      }
      .dot {
        opacity: 0.2;
      }
    }
  }

  .activity-panel {
    width: 100%;
    padding:0 8%;
    margin: 0 auto;
    margin-top:150px;
    .box {
      overflow: hidden;
      // position: relative;
      z-index: 0;
      margin-top: 25px;
      box-sizing: border-box;
      border: 1px solid rgba(0, 0, 0, 0.14);
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 3px 8px -6px rgba(0, 0, 0, 0.1);
    }
    .content {
      float: left;
      position: relative;
      box-sizing: border-box;
      width: 25%;
      height: 200px;
      text-align: center;
    }
    .content ::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      box-sizing: border-box;
      border-left: 1px solid #f2f2f2;
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      width: 100%;
      height: 100%;
      content: "";
      pointer-events: none;
    }
    .i {
      width: 305px;
      height: 200px;
    }
    .cover-link {
      cursor: pointer;
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 4;
      background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==)
        repeat;
    }
    a {
      color: #5079d9;
      cursor: pointer;
      transition: all 0.15s ease-out;
      text-decoration: none;
    }
    a:hover {
      box-shadow: inset 0 0 38px rgba(0, 0, 0, 0.08);
      transition: all 0.15s ease;
    }
  }

  .banner,
  .banner span,
  .banner div {
    font-family: "Microsoft YaHei";
    transition: all 0.3s;
    transition-timing-function: linear;
  }

  .banner {
    cursor: pointer;
    perspective: 3000px;
    position: relative;
    margin: 0 auto 40px;
    width: 100%;
  }

  .bg {
    position: relative;
    width: 100%;
    padding:0 8%;
    height: 500px;
    margin: 20px auto;
    background-size: 100% 100%;
    border-radius: 10px;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    transform: rotateY(0deg) rotateX(0deg);
    & div {
      position: relative;
      height: 100%;
      width: 100%;
    }
  }
  .sk_item {
    width: 170px;
    height: 225px;
    padding: 0 14px 0 15px;
    > div {
      width: 100%;
    }
    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: all 0.3s;
      &:hover {
        transform: translateY(-5px);
      }
    }
    img {
      width: 130px;
      height: 130px;
      margin: 17px 0;
    }
    .sk_item_name {
      color: #999;
      display: block;
      max-width: 100%;
      _width: 100%;
      overflow: hidden;
      font-size: 12px;
      text-align: left;
      height: 32px;
      line-height: 16px;
      word-wrap: break-word;
      word-break: break-all;
    }
    .sk_item_price {
      padding: 3px 0;
      height: 25px;
    }
    .price_new {
      font-size: 18px;
      font-weight: 700;
      margin-right: 8px;
      color: #f10214;
    }
    .price_origin {
      color: #999;
      font-size: 12px;
    }
  }

  .box {
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-top: 29px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, 0.1);
  }

  ul.box {
    display: flex;
    li {
      flex: 1;
      img {
        display: block;
        width: 305px;
        height: 200px;
      }
    }
  }

  .mt30 {
    margin-top: 30px;
  }

  .hot {
    display: flex;
    > div {
      flex: 1;
      width: 25%;
    }
  }

  .floors {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .imgbanner {
      width: 49%;
      height: 320px;
      margin:10px 0 10px 1% ;
      
      .cover-link {
        cursor: pointer;
        display: block;
        position: absolute;
        top: 60px;
        left: 0;
        width: 50%;
        height: 350px;
        z-index: 4;
        background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==)
          repeat;
      }
      .cover-link:hover {
        box-shadow: inset 0 0 38px rgba(0, 0, 0, 0.08);
        transition: all 0.15s ease;
      }
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .box-card {
      width: 92%;
      margin:0 4%;
      height: 200px;
      // padding:0 8%;
      position:absolute;
      bottom:-140px;
    }
    .buy{
      position: relative;
    }
  .buy-topic{
    position: absolute;
    top: 20px;
    left:80px;
    z-index:99999;
    cursor: pointer;
    .buy-content{
      font-size:20px;
      margin:0 20px;
      padding: 5px 0;
      font-weight: 300;
      display: inline-block;
    
    }
  }

</style>


