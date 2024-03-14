<script lang="ts" setup>
import {
  requestCourseTypeList,
  requestCourseListCard,
  ICourseCard,
  ICourseCategory,
} from '@/api/modules/study';
import { getLevel, getCharge } from '@/utils/level';
import { requestWithPage } from '@/types/reqOptions';
import { GoldMedal } from '@element-plus/icons-vue';
const categoryIndex = ref(0);
interface CourseList {
  name: string;
  value?: string;
  data: { label: string; code: string | number }[];
}
const cardList = ref<ICourseCard[]>([]);
let requestParams = reactive<requestWithPage>({
  recommend: 1,
  pageSize: 10,
  pageNum: 1,
});
const categoryList = ref<ICourseCategory[]>([]);
requestCourseTypeList()
  .then((res) => {
    categoryList.value.push(...res.data);
    // 默认选中第一个
    requestParams.courseType = categoryList.value[0].objId;
  })
  .then(() => {
    getCardList();
  });
const getCardList = () => {
  requestCourseListCard(requestParams).then((res) => {
    cardList.value = res.rows;
  });
};

function tabClick({ index }: any) {
  requestParams.courseType =
    categoryList.value[index].objId === 0
      ? null
      : categoryList.value[index].objId;
  getCardList();
}
</script>

<template>
  <section class="relative mt-10 mx-auto w-700px xl:w-1100px 2xl:w-1400px">
    <div class="absolute flex top-2 text-2xl">
      <GoldMedal
        style="width: 1em; height: 1em; margin-right: 8px"
        class="text-#ff7a38"
      />
      <h2>热门课程</h2>
    </div>
    <el-button
      class="absolute flex top-4 right-5 z-40"
      link
      type="primary"
      @click="() => $router.push('/study')"
    >
      <el-icon><Right /></el-icon>全部</el-button
    >
    <el-tabs @tab-click="tabClick">
      <template v-for="item of categoryList" :key="item.id">
        <el-tab-pane :lazy="true" class="flex flex-wrap gap-6">
          <template #label>
            <span>{{ item.typeName }}</span>
          </template>
          <!-- <component :is="item.component" v-if="selected == index" /> -->
          <template v-for="card in cardList" :key="card.objId">
            <!-- <template
            v-for="card in Array.from({ length: 4 }).flatMap(() => cardList)"
            :key="card.id"
          > -->
            <router-link :to="'/study/' + card.objId">
              <el-card class="w-320px">
                <div class="rounded-4 overflow-hidden h-160px">
                  <img
                    :src="card.coursePic"
                    class="w-full h-full object-fill"
                  />
                </div>
                <p class="font-700">{{ card.courseName }}</p>
                <div
                  class="rounded-2 bg-#e5e7eb p-2 text-#9ca3af text-ellipsis whitespace-nowrap overflow-hidden"
                >
                  <el-tooltip :content="card.courseDescription">
                    {{ card.courseDescription }}
                  </el-tooltip>
                </div>
                <p class="text-gray-500 text-sm mt-2">
                  {{ getLevel(card.courseDifficulty) }}·{{
                    card.studyCount
                  }}人学过
                </p>
              </el-card>
            </router-link>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
  </section>
</template>

<style lang="scss" scoped>
.title {
  font-size: 32px;
  font-weight: bold;
  line-height: 100px;
}

.user-info {
  margin: 20px auto;
  font-weight: bold;
  color: green;
}
</style>
