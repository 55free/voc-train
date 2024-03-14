<script lang="ts" setup>
import { Right, TakeawayBox } from '@element-plus/icons-vue';
import Exam from './components/exam.vue';
import experiment from './components/experiment.vue';
import study from './components/study.vue';
import { getCourseWareListCard, IChannelCard } from '@/api/modules/welcome';

import { getLevel } from '@/utils/level';
const courseWareList = ref<IChannelCard[]>([]);
getCourseWareListCard({ recommend: 1 }).then((res) => {
  courseWareList.value = res.rows;
});

const activeCategory = ref(1);
function tabClick({ index }: any) {
  activeCategory.value = index;
}
</script>

<template>
  <el-carousel :interval="5000" arrow="always">
    <el-carousel-item v-for="item in 4" :key="item">
      <h3 text="2xl" justify="center">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
  <study />

  <Exam />
  <section class="relative mt-10 mx-auto w-700px xl:w-1100px 2xl:w-1400px">
    <div class="flex justify-between mb-4">
      <div class="flex top-2 text-2xl">
        <TakeawayBox
          style="width: 1em; height: 1em; margin-right: 8px"
          class="text-indigo"
        />

        <h2>课件查看</h2>
      </div>
      <el-button
        class="flex top-4 right-5 z-40"
        link
        type="primary"
        @click="() => $router.push({ name: 'WareList' })"
        ><el-icon><Right /></el-icon>全部</el-button
      >
    </div>
    <div class="grid grid-cols-3 gap-8 xl:grid-cols-4 2xl:grid-cols-5">
      <template v-for="ware in courseWareList" :key="ware.objId">
        <router-link :to="`/study/ware/${ware.objId}`">
          <el-card class="flex flex-wrap justify-center max-w-[310px]">
            <div class="rounded-4 overflow-hidden">
              <img :src="ware.cwPath" class="card-image mx-auto block" />
            </div>
            <div>
              <span class="font-700 pl-1">{{ ware.cwName }}</span>
              <div class="bottom flex items-center">
                <span
                  >{{ getLevel(ware.difficulty) }}
                  {{ ware.cwCount }} 人学过</span
                >
              </div>
            </div>
          </el-card>
        </router-link>
      </template>
    </div>
  </section>
  <experiment />
  <!-- <section class="relative mt-10 mx-30">
    <div class="absolute flex top-2 text-2xl">
      <img
        src="@/assets/svg/medal-sport.svg"
        class="w-6 h-6"
        mode="scaleToFill"
      />
      <h2>现场实验</h2>
    </div>
    <el-button
      class="absolute flex top-4 right-5 z-40"
      link
      type="primary"
      @click="() => $router.push('/experiment')"
      ><el-icon><Right /></el-icon>全部</el-button
    >
    <el-tabs @tab-click="tabClick">
      <template v-for="item of categoryList" :key="item.id">
        <el-tab-pane
          :lazy="true"
          class="grid grid-cols-3 gap-8 xl:grid-cols-4 2xl:grid-cols-5"
        >
          <template #label>
            <span>{{ item.name }}</span>
          </template>
          <template v-for="item in 10" :key="item">
            <el-card class="flex flex-wrap justify-center max-w-[310px]">
              <img
                src="@/assets/images/pythonTest.png"
                class="card-image mx-auto block"
              />
              <div class="w-full max-w-[240px]">
                <span class="font-700 pl-1">Python 岗位笔试</span>
                <div class="bottom flex items-center justify-between">
                  <span>初级 888 人学过</span>
                  <router-link to="/exam/detail/1">
                    <el-button round type="primary" class="button"
                      >开始考试</el-button
                    >
                  </router-link>
                </div>
              </div>
            </el-card>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
  </section> -->
</template>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.active {
  background: #000;
  p {
    color: white;
  }
}
.category {
  font-weight: 700;
  div {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}
.card-image {
  width: 100%;
  max-width: 240px;
  height: 130px;
  object-fit: fill;
}

:deep(.el-tabs__header) {
  position: relative;
  padding-left: 10rem;
  padding-right: 1.5rem;
}
// :deep(.el-tab-pane) {
//   justify-content: space-around;
// }
</style>
