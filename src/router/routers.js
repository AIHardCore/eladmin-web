import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/',
    redirect: '/Home',
    component: () => import('@/layout/app/index'),
    hidden: true,
    children: [
      {
        path: 'Home', // 默认子路由
        name: 'Home',
        component: () => import('@/views/app/Home')
      },
      {
        path: 'Rank',
        name: 'Rank',
        component: () => import('@/views/app/Rank')
      },
      {
        path: 'Specials',
        name: 'Specials',
        component: () => import('@/views/app/Specials')
      },
      {
        path: 'SpecialInfo',
        name: 'SpecialInfo',
        component: () => import('@/views/app/SpecialInfo')
      },
      {
        path: 'My',
        name: 'My',
        component: () => import('@/views/app/My')
      },
      {
        path: 'Article',
        name: 'Article',
        component: () => import('@/views/app/Article')
      },
      {
        path: 'Result',
        name: 'Result',
        component: () => import('@/views/app/Result')
      }
    ]
  }
]

export default new Router({
  mode: 'hash',
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
