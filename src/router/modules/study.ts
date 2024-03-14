export default {
  path: '/study',
  name: 'Study',
  redirect: '/study/list',
  meta: {
    title: '学习',
    rank: 2,
  },
  children: [
    {
      path: '/study/list',
      name: 'List',
      meta: {
        title: '信息页',
      },
      component: () => import('@/views/study/list.vue'),
    },
    {
      path: '/study/:id',
      name: 'StudyInfo',
      meta: {
        title: '学习界面',
        showLink: false,
      },
      component: () => import('@/views/study/learn.vue'),
    },
    {
      path: '/study/ware/:id',
      name: '课件界面',
      meta: {
        title: '课件界面',
        showLink: false,
      },
      component: () => import('@/views/study/ware.vue'),
    },
  ],
};
