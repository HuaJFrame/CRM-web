import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Manager',
      component: () => import('@/components/Manager.vue'),
      redirect: "/home",
      children: [
        { path: '/home', name: 'Home', component: () => import("@/components/Home.vue") }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/Login.vue')
    }
  ]
})