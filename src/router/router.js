import Vue from 'vue'
import Router from 'vue-router'
import Goods from "../components/goods/Goods";
import Seller from "../components/seller/Seller";
import Ratings from "../components/ratings/Ratings"

Vue.use(Router)

let routes=[
  { path:'/' , component: Goods },
  { path:'/goods' , component:Goods },
  { path:'/seller' , component: Seller },
  { path:'/ratings' , component: Ratings },
]

export default new Router({
  routes,
  mode:'history',
  linkActiveClass:'active'
})
