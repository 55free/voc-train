export default {
  path: '/search',
  name: 'Search',
  redirect: '/search/:input',
  meta: {
    title: '搜索',
    showLink: false,
  },
  children: [
    {
      path: '/search/:input',
      name: 'SearchInfo',
      meta: {
        title: '搜索',
      },
      component: () => import('@/views/search/index.vue'),
    },
  ],
};
