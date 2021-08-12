import Vue from 'vue'
import VueRouter from 'vue-router'
const Index = () => import('@/page/index');
const Login = () => import('@/page/Login');
const Register = () => import('@/page/Register');
const GoodDetail = () => import('@/page/GoodDetail');
const Home = () => import('@/page/Home');
const AddGood  = () => import('@/page/AddGood');
const mine  = () => import('@/page/Mine/mine');
const mycollect  = () => import('@/page/Mine/children/mycollect');
const information  = () => import('@/page/Mine/children/information');
const mypublish  = () => import('@/page/Mine/children/mypublish');
const goods  = () => import('@/page/Goods');
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
    {
        path: "/",
        redirect: '/home',
        name: 'home',
        component: Index,
       
        children: [
          {
            path: "home",
            component: Home,
            
          },
          {
            path: "addgood",
            component: AddGood,
            meta:{auth:true}
          },
          {
            path: "goodDetail",
            component: GoodDetail,
            meta:{auth:true}
          },
          {
            path: '/mine',
            name: 'mine',
            component: mine,
            redirect: '/mine/mycollect',
            children: [
              {path: 'mycollect', name: '订单列表', component: mycollect,meta:{auth:true}},
              {path: 'information', name: '账户资料', component: information,meta:{auth:true}},
              {path: 'mypublish', name: '我的发布', component: mypublish,meta:{auth:true}},
            ]
          },
          {
            path: 'goods',
            name: 'goods',
            component: goods
          }
        ]
      },
    {path: '/login', name: 'login', component: Login},
    {path: '/register', name: 'register', component: Register,
    // meta:{auth:true}//设置当前路由需要校验
  },

]
const router = new VueRouter({
    routes
})
export default router