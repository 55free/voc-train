export default {
  path: '/exam',
  name: 'Exam',
  redirect: '/exam/list',
  meta: {
    title: '考试',
    rank: 3,
  },
  children: [
    {
      path: '/exam/list',
      name: 'ExamList',
      meta: {
        title: '考试列表',
        keepAlive: true,
        requireAuth: true,
      },
      component: () => import('@/views/exam/list.vue'),
    },
    {
      path: '/exam/detail/:id',
      name: 'ExamDetail',
      meta: {
        title: '考试详情',
        showLink: false,
      },
      component: () => import('@/views/exam/detail.vue'),
    },
    {
      path: '/exam/quiz/:id',
      name: 'ExamGoing',
      meta: {
        title: '考试中',
        showLink: false,
      },
      component: () => import('@/views/exam/ongoing.vue'),
    },
    // {
    //   path: '/exam/my',
    //   name: 'ExamMy',
    //   meta: {
    //     title: '我的考试',
    //     showLink: false,
    //   },
    //   component: () => import('@/views/exam/my.vue'),
    // },
    {
      path: '/exam/finished/:id',
      name: 'ExamFinished',
      meta: {
        title: '我的考试',
        showLink: false,
      },
      component: () => import('@/views/exam/finished.vue'),
    },
  ],
};
