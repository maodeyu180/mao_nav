import { createRouter, createWebHistory } from 'vue-router'
import NavHomeView from '../views/NavHomeView.vue'
import TestView from '../views/TestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: NavHomeView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: {
        title: '管理后台 - 小牛搜索',
        requiresAuth: true
      }
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
      meta: {
        title: '环境变量测试 - 小牛搜索'
      }
    },
  ],
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title
  } else {
    document.title = '小牛搜索'
  }

  next()
})

export default router
