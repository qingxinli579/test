<template>
  <div class="item">
      <el-carousel>
    <el-carousel-item :label="o.lable" v-for="o in data" :key="o.lable">
      <div  style="position:raletive;width:30%;height:320px;background:rgb(241, 238, 238);float:left">
        <div style="position:absolute;bottom:40%;left:100px;z-index:99;color:orange">
          
          <p style="font-size:30px;margin-bottom:10px;">
            <i :class="o.ico"></i>
            {{o.value}}
          </p>
          <p style="font-size:17px;font-weight:200">
            {{o.value2}}
          </p>
        </div>
      </div>
      <div class="bg">

      </div>
      <!-- <img style="width:100%;height:280px;filter:alpha(opacity=50,finishopacity=0,style=2)" :src=o.img alt=""> -->
    </el-carousel-item>
  </el-carousel>
  </div>
</template>
<script>

export default {
  data(){
    return{
     
      
    }
  },
  props: ["data"],

  methods: {
    
  },
  created(){
  }
};
</script>

<style lang="scss" scoped>
.item{
  background: rgb(241, 238, 238) ;
  /deep/ .el-carousel__button{
    border: none;
    background: none;
    font-size: 16px;
    color:#000
  }
  /deep/ .el-carousel__indicators--labels{
    bottom: 60px;
    right:40%;
    
    
  }
  /deep/ .el-carousel__arrow {
      display: none !important;
    }
}
  //   .el-carousel__item h3 {
  //   color: #475669;
  //   font-size: 18px;
  //   opacity: 0.75;
  //   line-height: 300px;
  //   margin: 0;
  // }
  
  // .el-carousel__item:nth-child(2n) {
  //   background-color: #99a9bf;
  // }
  
  // .el-carousel__item:nth-child(2n+1) {
  //   background-color: #d3dce6;
  // }
  .bg{
     background: linear-gradient(to right, rgb(241, 238, 238), transparent), url("https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2002182095,2757208147&fm=26&gp=0.jpg");
            // background-position: center;
            // background-blend-mode: normal;
            background-size: 100% 100%;
            // position: absolute;
            height: 280px;
            width: 70%;
            // right: 0;
            float:left

  }
</style>