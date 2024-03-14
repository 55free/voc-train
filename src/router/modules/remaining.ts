import { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      showLink: false,
      rank: 101,
    },
  },
  {
    path: '/data-screen',
    name: 'dataScreen',
    component: () => import('@/views/data-screen/index.vue'),
    meta: {
      title: '数据大屏',
      showLink: false,
    },
  },
  {
    path: '/live/webcourse/:id',
    name: 'WebCourse',
    meta: {
      title: '课程直播',
      showLink: false,
    },
    component: () => import('@/views/live/webCourse.vue'),
  },
] as Array<RouteRecordRaw>;
