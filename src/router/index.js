import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/device/clientManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'clientManage',
        component: () => import('@/views/clientManage/index'),
        meta: { title: '客户管理', icon: 'el-icon-s-help' }
      }
    ]
  },
  {
    path: '/device/orderManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'orderManage',
        component: () => import('@/views/orderManage/index'),
        meta: { title: '工单管理', icon: 'el-icon-s-help' }
      }
    ]
  },
  {
    path: '/device/configInfo',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'configInfo',
        component: () => import('@/views/configInfo/index'),
        meta: { title: '设备配置', icon: 'el-icon-s-help' }
      }
    ]
  },

  {
    path: '/device/reportInfo',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'reportInfo',
        component: () => import('@/views/keyInfo/index'),
        meta: { title: '运行状态', icon: 'el-icon-s-help' }
      }
    ]
  },

  {
    path: '/device/keyInfo',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'keyInfo',
        component: () => import('@/views/reportInfo/index'),
        meta: { title: 'ppk和fpk设置', icon: 'el-icon-s-help' }
      }
    ]
  },

  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },

  // {
  //   path: '/404',
  //   component: () => import('@/views/404'),
  //   hidden: true
  // },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/device/configInfo/index', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
