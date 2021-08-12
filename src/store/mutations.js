import {
  INIT_BUYCART,
  ADD_CART,
  // GET_USERINFO,
  RECORD_USERINFO,
  ADD_ANIMATION,
  SHOW_CART,
  REDUCE_CART,
  EDIT_CART
} from './mutation-types'
import { setStore, getStore } from '../utils/storage'
export default {
  // 网页初始化时从本地缓存获取收藏夹数据
  [INIT_BUYCART] (state) {
    let initCart = getStore('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
      
    }
  },
  // 加入收藏夹
  [ADD_CART] (state, {goods_id, price, brand, goods_picture}) {
    let cart = state.cartList // 收藏夹
    let goods = {
      goods_id,
      price,
      brand,
      goods_picture
    }

      cart.push(goods)
      state.cartList = cart
    // 存入localStorage
      setStore('buyCart', cart)
  },
  // 加入收藏夹动画
  [ADD_ANIMATION] (state, {moveShow, elLeft, elTop, img, cartPositionT, cartPositionL, receiveInCart}) {
    state.showMoveImg = moveShow
    if (elLeft) {
      state.elLeft = elLeft
      state.elTop = elTop
    }
    state.moveImgUrl = img
    state.receiveInCart = receiveInCart
    if (cartPositionT) {
      state.cartPositionT = cartPositionT
      state.cartPositionL = cartPositionL
    }
  },
  //是否显示收藏夹
  [SHOW_CART] (state, {showCart}) {
    // let timer = null
    state.showCart = showCart
    // clearTimeout(timer)
    // if (showCart) {
    //   timer = setTimeout(() => {
    //     state.showCart = false
    //   }, 5000)
    // }
  },
  // 移除商品
  [REDUCE_CART] (state, {goods_id}) {
    let cart = state.cartList
    cart.forEach((item, i) => {
      if (item.goods_id === goods_id) {
          cart.splice(i, 1)
      }
    })
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 修改收藏夹
  [EDIT_CART] (state, {goods_id}) {
    let cart = state.cartList
    cart.forEach((item, i) => {
      if (item.goods_id === goods_id) {
        cart.splice(i, 1)
      }
    })
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 记录用户信息
  [RECORD_USERINFO] (state, info) {
    state.userInfo = info
    setStore('userInfo', info)
  },
  // // 获取用户信息
  // [GET_USERINFO] (state, info) {
  //   if (state.userInfo && (state.userInfo.userName !== info.userName)) {
  //     return
  //   }
  //   // if (!state.login) {
  //   //   return
  //   // }
  //   if (!info.message) {
  //     state.userInfo = {...info}
  //   } else {
  //     state.userInfo = null
  //   }
  // }
}
