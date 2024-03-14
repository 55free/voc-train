export default {
  path: '/experiment',
  name: 'Experiment',
  redirect: '/experiment/list',
  meta: {
    title: '实验',
    rank: 10,
  },
  children: [
    {
      path: '/experiment/list',
      name: 'ExperimentList',
      meta: {
        title: '实验列表',
      },
      component: () => import('@/views/experiment/list.vue'),
    },
  ],
};
