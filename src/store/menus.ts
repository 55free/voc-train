import { defineStore } from 'pinia';
import { constantMenus } from '@/router';
import { RouteRecordRaw } from 'vue-router';
import { filterTree, ascending } from '@/router/utils';
import { selectedMenuStorage, setSelectedMenuStorage } from '@/utils/storage';
interface MenusInfo {
  constantMenus: RouteRecordRaw[];
  wholeMenus: RouteRecordRaw[];
  cachePageList: any[];
  selectedMenu: number;
}
const useMenusStore = defineStore({
  id: 'menus',
  state(): MenusInfo {
    return {
      // 静态路由生成的菜单
      constantMenus,
      // 整体路由生成的菜单（静态、动态）
      wholeMenus: [],
      // 缓存页面keepAlive
      cachePageList: [],
      selectedMenu: selectedMenuStorage.value || 0,
    };
  },
  actions: {
    handleWholeMenus(routes: any[]) {
      // console.log('before', { ...this.constantMenus });
      this.wholeMenus = filterTree(
        ascending(this.constantMenus.concat(routes)),
      );

      // console.log('after', { ...this.constantMenus });
    },
    setSelectedMenu(selectedMenu: number) {
      setSelectedMenuStorage(selectedMenu);
      this.selectedMenu = selectedMenu;
    },
  },
});

export default useMenusStore;
