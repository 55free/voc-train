<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue';
import LoginButton from '../LoginButton.vue';
import ThemeSwitcher from '../ThemeSwitcher.vue';

import { Search, Setting, List } from '@element-plus/icons-vue';
import useMenusStore from '@/store/menus';

let menusStore = useMenusStore();
const selectedMenu = computed(() => {
  return menusStore.selectedMenu;
});
let routes = menusStore.wholeMenus;
const searchInput = ref('');
// console.log('constantMenus', menusStore.constantMenus);
const handleMenuClick = (index: number) => {
  menusStore.setSelectedMenu(index);
};
</script>
<template>
  <nav
    class="header-nav flex flex-row justify-center items-center pr-12 2xl:pr-0"
  >
    <div class="nav-left hidden flex-row justify-between items-center xl:flex">
      <router-link to="/" class="flex justify-center items-center flex-col">
        <h2 class="font-900 text-red-600 text-lg">贵州省科学技术厅</h2>
        <p class="font-medium">kji.guizhou.gov.cn</p>
      </router-link>
      <h1 class="ml-2 text-xl font-bold hidden 2xl:block">
        云端协同大数据教学综合管理平台
      </h1>
    </div>

    <!-- 移动端菜单样式 -->
    <el-dropdown trigger="click" class="inline-flex md:!hidden">
      <List style="width: 2rem; height: 2rem" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(route, index) in routes" :key="route.path">
            <router-link :to="route.path">
              <span :class="{ 'text-blue': selectedMenu === index }">{{
                route.meta!.title
              }}</span>
            </router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown
      v-for="(route, index) in routes"
      :key="route.path"
      class="menu-list !hidden md:!inline-flex"
    >
      <span
        v-if="route.children!.length <= 1"
        class="cursor-pointer text-lg font-medium text-dark dark:text-light hover:text-blue dark:hover:text-primary-light"
      >
        <router-link :to="route.path">
          <span
            :class="{ 'text-blue': selectedMenu === index }"
            @click="handleMenuClick(index)"
            >{{ route.meta!.title }}</span
          >
        </router-link>
      </span>
      <span
        v-else
        :class="{ 'text-blue': selectedMenu === index }"
        class="text-lg font-medium text-dark dark:text-light"
      >
        {{ route.meta!.title }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template v-if="route.children!.length > 1" #dropdown>
        <el-dropdown-menu>
          <router-link
            v-for="child in route.children"
            :key="child.path"
            :to="child.path"
          >
            <el-dropdown-item>
              {{ child.meta?.title }}
            </el-dropdown-item>
          </router-link>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-input
      v-model="searchInput"
      class="m-2 rounded-md max-w-250px"
      placeholder="课程/考试/实验名称"
      clearable
      :prefix-icon="Search"
      @change="
        $router.push({ name: 'SearchInfo', params: { input: searchInput } })
      "
    />

    <div class="nav-right hidden flex-row justify-between items-center xl:flex">
      <LoginButton />
      <ThemeSwitcher class="switch-icon" />
      <div class="flex">
        <!-- <div class="font-bold ml-2">后台管理</div>
        <div class="font-bold ml-2 text-amber">小程序 (二)</div> -->
        <router-link to="/data-screen" class="font-bold ml-2"
          ><div class="font-bold ml-2">分析大屏</div></router-link
        >
      </div>
    </div>
    <el-dropdown class="nav-right inline-flex xl:!hidden">
      <div style="font-size: 40px">
        <Setting style="width: 2rem; height: 2rem" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <ThemeSwitcher class="switch-icon"
          /></el-dropdown-item>
          <!-- <el-dropdown-item
            ><div class="font-bold ml-2">后台管理</div></el-dropdown-item
          >
          <el-dropdown-item
            ><div class="font-bold ml-2 text-amber">
              小程序
            </div></el-dropdown-item
          > -->
          <el-dropdown-item>
            <router-link to="/data-screen" class="font-bold ml-2"
              >分析大屏</router-link
            ></el-dropdown-item
          >

          <el-dropdown-item> <LoginButton /></el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </nav>
</template>
<style lang="scss" scoped>
.header-nav {
  width: 100%;
  height: 100%;
}
.nav-left {
  position: absolute;
  left: 20px;
  top: 12px;
}

.logo {
  width: 30px;
  height: 30px;
}

.nav-items {
  margin-left: 10px;
}

.nav-right {
  position: absolute;
  right: 20px;
  top: 12px;
}

.title {
  line-height: 60px;
  font-weight: bold;

  &.title-sm {
    font-size: 12px;
  }
}

.switch-icon {
  margin-left: 20px;
}

.menu-list {
  background: none;
  width: 80px;
  margin-left: 10px;

  .menu-item {
    width: 100px;
  }
}
</style>
