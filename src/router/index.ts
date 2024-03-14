import { getToken } from '@/utils/token';
import {
  ascending,
  buildHierarchyTree,
  formatFlatteningRoutes,
  initRouter,
  formatTwoStageRoutes,
} from './utils';
import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  Router,
} from 'vue-router';
import useMenusStore from '@/store/menus';
import { useUserStore } from '@/store/user';
const Layout = () => import('@/components/shared/LayOut.vue');
import remainingRouter from './modules/remaining';
import { isEmpty } from '@/utils/helper';

const modules: Record<string, any> = import.meta.glob(
  ['./modules/**/*.ts', '!./modules/**/remaining.ts'],
  {
    eager: true,
  },
);
// 原始路由. 未作处理
const routes: Array<RouteRecordRaw> = [];

// 导入全部静态路由
Object.keys(modules).forEach((key) => {
  routes.push(modules[key].default);
});

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity)))),
);

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteRecordRaw> = JSON.parse(
  JSON.stringify(ascending(routes.flat(Infinity))),
);

/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map((v) => {
  return remainingRouter[v as unknown as number].path;
});

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes.concat(...(remainingRouter as any)),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return { ...savedPosition, behavior: 'smooth' };
    } else {
      return { top: 0 };
    }
  },
});

/** 路由白名单 */
const whiteList = ['/'];

// router.beforeEach(async (to, from, next) => {
//   // const token = getToken();
//   // if (!token && to.name !== 'Index') {
//   //     return { name: 'Index' };
//   // }
//   if (to.path !== '/login') {
//     initRouter().then(() => {
//       if (isEmpty(to.name)) router.push(to.fullPath);
//     });
//   }
//   next();
// });

router.beforeEach((to, _from, next) => {
  console.log('useUserStore().isLogin', useUserStore().username);

  const userInfo = useUserStore().username;
  /** 如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面 */
  function toCorrectRoute() {
    whiteList.includes(to.fullPath) ? next(_from.fullPath) : next();
  }

  // 无权限跳转403页面
  // if (to.meta?.roles) {
  //   next({ path: '/error/404' });
  // }
  if (_from?.name) {
    // name为超链接
    toCorrectRoute();
  } else {
    // 刷新
    if (useMenusStore().wholeMenus.length === 0 && to.path !== '/login') {
      initRouter().then((router: Router) => {
        // 确保动态路由完全加入路由列表并且不影响静态路由（注意：动态路由刷新时router.beforeEach可能会触发两次，第一次触发动态路由还未完全添加，第二次动态路由才完全添加到路由列表，如果需要在router.beforeEach做一些判断可以在to.name存在的条件下去判断，这样就只会触发一次）
        if (isEmpty(to.name)) {
          router.push(to.fullPath);
        }
      });
    }
    toCorrectRoute();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title as string;
  // 打印当前路由信息
  // console.log('afterEach', to);
  console.log('allroute', router);
});

/** 重置路由 */
function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name, meta } = route;
    if (name && router.hasRoute(name) && meta?.backstage) {
      router.removeRoute(name);
      router.options.routes = formatTwoStageRoutes(
        formatFlatteningRoutes(
          buildHierarchyTree(ascending(routes.flat(Infinity))),
        ),
      );
    }
  });
}

export { router, resetRouter };
