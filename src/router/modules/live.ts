export default {
  path: '/live',
  name: 'Live',
  redirect: '/live/live1',
  meta: {
    title: '直播',
    rank: 10,
  },
  children: [
    {
      path: '/live/live1',
      name: 'live1',
      meta: {
        title: 'live1',
      },
      component: () => import('@/views/live/live1.vue'),
    },
    {
      path: '/live/playback/:id',
      name: 'PlayBack',
      meta: {
        title: '回放',
        showLink: false,
      },
      component: () => import('@/views/live/playback.vue'),
    },
  ],
};
