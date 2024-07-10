import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
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
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    redirect: '/Auth',
    component: () => import('@/layout/app/index'),
    hidden: true,
    children: [
      {
        path: 'Auth', // 授权检查
        name: 'Auth',
        component: () => import('@/views/app/Auth')
      },
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
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/home'], resolve),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: '个人中心',
        meta: { title: '个人中心' }
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
