<script lang="ts" setup>
import { VideoPlay } from '@element-plus/icons-vue';
const recourses = ref([
  {
    name: '试听课程入口',
    id: 0,
    children: [
      {
        name: '试听课程1',
        id: 1,
        classTime: '1分钟',
      },
      {
        name: '试听课程2',
        id: 2,
        classTime: '654分钟',
      },
      {
        name: '试听课程3',
        id: 3,
        classTime: '166分钟',
      },
    ],
  },
  {
    name: '弱电直播',
    id: 96,
    children: [
      {
        name: '试听课程1',
        id: 18,
        classTime: '1分钟',
      },
      {
        name: '试听课程2',
        id: 27,
        classTime: '654分钟',
      },
      {
        name: '试听课程3',
        id: 38,
        classTime: '166分钟',
      },
    ],
  },
  {
    name: '交流电',
    id: 96,
    children: [
      {
        name: '试听课程1',
        id: 18,
        classTime: '1分钟',
      },
      {
        name: '试听课程2',
        id: 27,
        classTime: '654分钟',
      },
      {
        name: '试听课程3',
        id: 38,
        classTime: '166分钟',
      },
    ],
  },
]);
</script>

<template>
  <div class="w-full">
    <el-menu
      active-text-color="#409eff"
      class="el-menu-vertical-demo"
      default-active="2"
      text-color="#000"
    >
      <el-sub-menu
        v-for="(re, i) in recourses"
        :key="re.id"
        :index="i.toString()"
      >
        <template #title>
          <span class="text-lg">{{ i + 1 + '.' + re.name }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="(v, ci) in re.children" :key="v.id">
            <div class="flex items-center text-sm w-full rounded-md">
              <VideoPlay style="width: 1rem; height: 1rem" />

              <div class="ml-4 text-left dark:text-light">
                <p class="leading-8 flex items-center text-base">
                  <span class="font-700 text-xl">{{ ci + 1 + '.' }}</span>
                  {{ v.name }}
                </p>
                <p class="text-sm text-coolgray dark:text-light">
                  {{ v.classTime }}
                </p>
              </div>
            </div>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped></style>
