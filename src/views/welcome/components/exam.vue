<script setup lang="ts">
import { Right, Wallet } from '@element-plus/icons-vue';
import {
  getExamCategory,
  IExamCategory,
  getExamCardList,
  IExamCard,
} from '@/api/modules/exam';
import type { requestWithPage } from '@/types/reqOptions';
import { useDictStore } from '@/store/dict';
import { storeToRefs } from 'pinia';
import { isEmpty } from '@/utils/helper';
const store = useDictStore();
const { examDict } = storeToRefs(store);
const cardList = ref<IExamCard[]>([]);
let requestParams = reactive<requestWithPage>({
  recommend: 1,
  pageSize: 10,
  pageNum: 1,
});
const categoryList = ref<IExamCategory[]>([]);
getExamCategory()
  .then((res) => {
    categoryList.value.push(...res.data);
    requestParams.examType = categoryList.value[0].objId;
  })
  .then(() => {
    getCardList();
  });
const getCardList = () => {
  getExamCardList(requestParams).then((res) => {
    cardList.value = res.rows;
  });
};

isEmpty(examDict) && store.getExamDict();

function tabClick({ index }: any) {
  requestParams.examType =
    categoryList.value[index].objId === 0
      ? null
      : categoryList.value[index].objId;
  getCardList();
}
</script>

<template>
  <section class="relative mt-10 mx-auto w-700px xl:w-1100px 2xl:w-1400px">
    <div class="absolute flex top-2 text-2xl">
      <Wallet
        style="width: 1em; height: 1em; margin-right: 8px"
        class="text-cyan"
      />
      <h2>考试</h2>
    </div>
    <el-button
      class="absolute flex top-4 right-5 z-40"
      link
      type="primary"
      @click="() => $router.push('/exam')"
      ><el-icon><Right /></el-icon>全部</el-button
    >
    <el-tabs @tab-click="tabClick">
      <template v-for="cate of categoryList" :key="cate.typeCode">
        <el-tab-pane
          :lazy="true"
          class="grid grid-cols-3 gap-8 xl:grid-cols-4 2xl:grid-cols-5"
        >
          <template #label>
            <span>{{ cate.typeName }}</span>
          </template>
          <!-- <component :is="item.component" v-if="selected == index" /> -->
          <template v-for="card in cardList" :key="card.objId">
            <router-link
              :to="{ name: 'ExamDetail', params: { id: card.objId } }"
            >
              <el-card class="flex flex-wrap justify-center max-w-[310px]">
                <img :src="card.imagePath" class="card-image mx-auto block" />
                <div>
                  <span class="font-700 pl-1">{{ card.examName }}</span>
                  <div class="bottom flex items-center justify-between">
                    <span
                      >{{ examDict[card.examCategory] }}
                      {{ card.count }} 人考过</span
                    >

                    <el-button round type="primary" class="button"
                      >开始考试</el-button
                    >
                  </div>
                </div>
              </el-card>
            </router-link>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
  </section>
</template>

<style scoped></style>
