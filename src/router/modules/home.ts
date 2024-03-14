const Layout = () => import('@/components/shared/LayOut.vue');
export default {
  path: '/',
  name: 'Index',
  meta: {
    title: '首页',
    rank: 0,
  },
  redirect: '/welcome',
  component: Layout,
  children: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: () => import('@/views/welcome/Index.vue'),
      meta: {
        title: '首页',
      },
    },
  ],
};
