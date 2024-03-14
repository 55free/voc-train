import { isEmpty } from '@/utils/helper';
import {
  RouterHistory,
  RouteRecordRaw,
  RouteComponent,
  createWebHistory,
  createWebHashHistory,
  Router,
} from 'vue-router';
import { getAsyncRoutes } from '@/api/modules/login';
import { router } from './index';
import useMenusStore from '@/store/menus';
// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob('@/views/**/*.{vue,tsx}');

// rank不存在或者不为首页返回true
function handleRank(routerInfo: any) {
  const { name, path, parentId, meta } = routerInfo;
  return isEmpty(parentId)
    ? isEmpty(meta.rank) || (meta.rank === 0 && name !== 'Home' && path !== '/')
      ? true
      : false
    : false;
}
// 对父级路由进行排序
function ascending(arr: any[]) {
  arr.forEach((v, index) => {
    // rank不存在,根据顺序自动创建
    if (handleRank(v)) {
      v.meta.rank = index + 2;
    }
  });
  return arr.sort((a, b) => {
    return a.meta.rank - b.meta.rank;
  });
}
/**
 * @description 创建层级关系
 * @param tree 树
 * @param pathList 每一项的id组成的数组
 * @returns 创建层级关系后的树
 */
const buildHierarchyTree = (tree: any[], pathList = []): any => {
  if (!Array.isArray(tree)) {
    console.warn('tree must be an array');
    return [];
  }
  if (!tree || tree.length === 0) return [];
  for (const [key, node] of tree.entries()) {
    node.id = key;
    node.parentId = pathList.length ? pathList[pathList.length - 1] : null;
    node.pathList = [...pathList, node.id];
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      buildHierarchyTree(node.children, node.pathList);
    }
  }
  return tree;
};

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
export function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  routesList = routesList.flatMap((route) => {
    if (route.children && route.children.length > 0) {
      return [route, ...route.children];
    } else {
      return route;
    }
  });
  return routesList;
}

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * https://github.com/pure-admin/vue-pure-admin/issues/67
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((v: RouteRecordRaw) => {
    if (v.path === '/') {
      newRoutesList.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: [],
      });
    } else {
      newRoutesList[0]?.children?.push({ ...v });
    }
  });
  return newRoutesList;
}

/** 过滤meta中showLink为false的菜单 */
function filterTree(data: RouteComponent[]) {
  const newTree = JSON.parse(JSON.stringify(data)).filter(
    (v: { meta: { showLink: boolean } }) => v.meta?.showLink !== false,
  );
  newTree.forEach(
    (v: { children: any }) =>
      v.children && (v.children = filterTree(v.children)),
  );
  return newTree;
}

/**
 * 将动态路由放在首页layout下
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
function formateTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((v: RouteRecordRaw) => {
    if (v.path === '/') {
      newRoutesList.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: [],
      });
    } else {
      newRoutesList[0]?.children?.push({ ...v });
    }
  });
  return newRoutesList;
}

function addPathMatch() {
  if (!router.hasRoute('pathMatch')) {
    router.addRoute({
      path: '/:pathMatch(.*)',
      name: 'pathMatch',
      redirect: '/error/404',
    });
  }
}

/** 过滤后端传来的动态路由 重新生成规范路由 */
// 对父级的redirect和name属性和component做兼容处理
function addAsyncRoutes(arrRoutes: Array<RouteRecordRaw>) {
  if (!arrRoutes || !arrRoutes.length) return;
  const modulesRoutesKeys = Object.keys(modulesRoutes);
  arrRoutes.forEach((v: RouteRecordRaw) => {
    // 将backstage属性加入meta，标识此路由为后端返回路由
    v.meta!.backstage = true;
    // 父级的redirect属性取值：如果子级存在且父级的redirect属性不存在，默认取第一个子级的path；如果子级存在且父级的redirect属性存在，取存在的redirect属性，会覆盖默认值
    if (v?.children && v.children.length && !v.redirect)
      v.redirect = v.children[0].path;
    // 父级的name属性取值：如果子级存在且父级的name属性不存在，默认取第一个子级的name；如果子级存在且父级的name属性存在，取存在的name属性，会覆盖默认值（注意：测试中发现父级的name不能和子级name重复，如果重复会造成重定向无效（跳转404），所以这里给父级的name起名的时候后面会自动加上`Parent`，避免重复）
    if (v?.children && v.children.length && !v.name)
      v.name = (v.children[0].name as string) + 'Parent';

    // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会跟path保持一致）
    const index = v?.component
      ? modulesRoutesKeys.findIndex((ev) => ev.includes(v.component as any))
      : modulesRoutesKeys.findIndex((ev) => ev.includes(v.path));
    v.component = modulesRoutes[modulesRoutesKeys[index]];
    // 对一级路由的component 置空
    // if (v.path.lastIndexOf('/') === 0 && v?.children?.length) {
    //   v.component = null;
    // }
    if (v?.children && v.children.length) {
      addAsyncRoutes(v.children);
    }
  });
  return arrRoutes;
}

function handleAsyncRoutes(routeslist: RouteRecordRaw[]) {
  useMenusStore().handleWholeMenus([]);
  // useMenusStore().handleWholeMenus(JSON.parse(JSON.stringify(routeslist)));
  // // 之后修改给静态路由
  // const _routes = formatFlatteningRoutes(addAsyncRoutes(routeslist) ?? []);

  // _routes.map((v) => {
  //   //  防止重复添加路由
  //   if (
  //     router.options.routes[0].children?.findIndex(
  //       (ev) => ev.path === v.path,
  //     ) !== -1
  //   ) {
  //     return;
  //   } else {
  //     router.options.routes[0].children?.push(v);
  //     ascending(router.options.routes[0].children);
  //     if (!router.hasRoute(v.name as string)) {
  //       router.addRoute(v);
  //     }
  //     // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
  //     const flattenRouters: any = router
  //       .getRoutes()
  //       .find((n) => n.path === '/');
  //     router.addRoute(flattenRouters);
  //   }
  // });

  addPathMatch();
}

function initRouter() {
  return new Promise<Router>((resolve, reject) => {
    // getAsyncRoutes()
    //   .then((res) => {
    //     handleAsyncRoutes(res.data);
    //     resolve(router);
    //   })
    //   .catch((err) => {
    //     reject(err);
    //   });

    handleAsyncRoutes(null);
    resolve(router);
  });
}

export {
  ascending,
  addAsyncRoutes,
  initRouter,
  formatTwoStageRoutes,
  buildHierarchyTree,
  filterTree,
};
