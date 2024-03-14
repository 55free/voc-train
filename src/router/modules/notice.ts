export default {
  path: '/notice',
  name: 'Index',
  meta: {
    title: '通告',
    rank: 12,
  },
  redirect: '/notice/all',

  children: [
    {
      path: '/notice/all',
      name: 'NoticeAll',
      component: () => import('@/views/notice/index.vue'),
      meta: {
        title: '首页',
      },
    },
  ],
};
