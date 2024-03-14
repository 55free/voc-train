export default {
  path: '/my',
  name: 'My',
  redirect: '/my/list',
  meta: {
    title: '我的',
    showLink: false,
  },
  children: [
    {
      path: '/my/list',
      name: 'MyList',
      meta: {
        title: '考试列表',
        keepAlive: true,
        requireAuth: true,
      },
      component: () => import('@/views/my/examCard.vue'),
    },
    {
      path: '/my/profile',
      name: 'Profile',
      meta: {
        title: '个人中心',
        keepAlive: true,
        requireAuth: true,
      },
      component: () => import('@/views/my/profile.vue'),
    },
  ],
};
