// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from "vue-router"
import VueResource from "vue-resource"
import App from './App'
// 引用的组件
import goods from "./components/goods/goods"
import ratings from "./components/ratings/ratings"
import seller from "./components/seller/seller"

import "./common/sass/index.scss"

Vue.config.productionTip = false
/* eslint-disable no-new */

Vue.use(VueRouter)
Vue.use(VueResource)
// 路径map
const routes = [
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller },
]
// 创建实例
const router = new VueRouter({
  linkActiveClass:"active",
  routes 
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  // el: "#app",
  router,
  // 不清楚为什么有这个函数，基础指引里面没有
  render: h => h(App)
}).$mount('#app')
// 原来的 go API升级了，
// https://router.vuejs.org/en/essentials/navigation.html
// https://router.vuejs.org/zh-cn/essentials/named-routes.html
// 只能只是前进后退，要采用push https://segmentfault.com/q/1010000007906160 
// router.push("/goods")

