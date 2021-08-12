import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import axios from "axios";
import { getStore } from "./utils/storage.js";
import VueLazyload from "vue-lazyload";
import store from "./store/";
Vue.use(VueLazyload, {
  // loading: require('img/loading.png'),//加载中图片，一定要有，不然会一直重复加载占位图
  // error: require('img/error.png')  //加载失败图片
});
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
//引入高德
// 引入vue-amap
import VueAMap from "vue-amap";
Vue.use(VueAMap);
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: "3ba365d48b8eaa69806dcfe6a4718306",
  // 插件集合
  plugin: [
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.Scale",
    "AMap.OverView",
    "AMap.ToolBar",
    "AMap.MapType",
    "AMap.PolyEditor",
    "AMap.CircleEditor",
    "AMap.Geolocation",
    "AMap.Geocoder",
  ],
  // 高德 sdk 版本，默认为 1.4.4
  v: "1.4.4",
});
router.beforeEach((to, from, next) => {
  if (to.matched.some((m) => m.meta.auth)) {
    // 对路由进行验证
    if (getStore("token")) {
      // 已经登陆
      next(); // 正常跳转到你设置好的页面
    } else {
      next({
        path: "/login",
      });
    }
  } else {
    next();
  }
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
