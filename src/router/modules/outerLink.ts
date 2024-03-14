const IFrame = () => import('@/components/shared/frameView.vue');

export default {
  path: '/outlink',
  redirect: '/outlink/index',
  meta: {
    icon: 'outlink',
    title: 'outlink',
    showLink: false,
  },
  children: [
    {
      path: '/outlink/index',
      name: 'Frameoutlink',
      component: IFrame,
      meta: {
        title: '内嵌IFrame',
        frameSrc: 'https://pipipi-pikachu.github.io/PPTist/',
        frameLoading: true,
      },
    },
  ],
};
