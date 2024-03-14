export default {
  path: '/ware',
  name: 'Ware',
  redirect: '/ware/list',
  meta: {
    title: '课件',
    rank: 11,
  },
  children: [
    {
      path: '/ware/list',
      name: 'WareList',
      meta: {
        title: '课件列表',
      },
      component: () => import('@/views/ware/list.vue'),
    },
  ],
};
