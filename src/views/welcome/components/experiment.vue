<script setup lang="ts">
import { Right, WindPower } from '@element-plus/icons-vue';
import {
  requestExpListCard,
  IExpCard,
  IExpType,
  requestExpTypeList,
} from '@/api/modules/experiment';
import type { requestWithPage } from '@/types/reqOptions';
const cardList = ref<IExpCard[]>([]);
let requestParams = reactive<requestWithPage>({
  recommend: 1,
  pageSize: 10,
  pageNum: 1,
});
const categoryList = ref<IExpType[]>([]);
requestExpTypeList()
  .then((res) => {
    categoryList.value.push(...res.data);
    // 默认选中第一个
    requestParams.expType = categoryList.value[0].objId;
  })
  .then(() => {
    getCardList();
  });
const getCardList = () => {
  requestExpListCard(requestParams).then((res) => {
    cardList.value = res.rows;
  });
};

function tabClick({ index }: any) {
  requestParams.examType =
    categoryList.value[index].objId === 0
      ? null
      : categoryList.value[index].objId;
  getCardList();
}
const getLevel = (level: string) => {
  switch (level) {
    case '1':
      return '初级';
    case '2':
      return '中级';
    case '3':
      return '高级';
    default:
      return '未知';
  }
};
const getCharge = (charge: number) => {
  switch (charge) {
    case 1:
      return '免费';
    case 2:
      return '收费';
    default:
      return '其他';
  }
};
</script>

<template>
  <section class="relative mt-10 mx-auto w-700px xl:w-1100px 2xl:w-1400px">
    <div class="absolute flex top-2 text-2xl">
      <WindPower
        style="width: 1em; height: 1em; margin-right: 8px"
        class="text-orange"
      />
      <h2>现场实验</h2>
    </div>
    <el-button
      class="absolute flex top-4 right-5 z-40"
      link
      type="primary"
      @click="() => $router.push({ name: 'ExperimentList' })"
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
            <a :href="card.expAddress" target="_blank">
              <el-card :body-style="{ padding: '0px' }" class="w-300px p-4">
                <img :src="card.expPic" class="w-250px h-90px" />
                <div>
                  <span class="font-700">{{ card.expName }}</span>
                  <div class="bottom flex items-center justify-between mb-4">
                    <span
                      >{{ getLevel(card.expDifficulty) }} ·
                      {{ getCharge(card.expCharge) }}</span
                    >
                    <!-- <el-button
                      round
                      type="primary"
                      class="button"
                      color="#0066ff"
                      >开始实验</el-button
                    > -->
                  </div>
                  <!-- 描述 -->
                  <el-tooltip :content="card.expDescription">
                    <p
                      class="text-ellipsis whitespace-nowrap overflow-hidden text-gray-500 text-sm"
                    >
                      {{ card.expDescription }}
                    </p>
                  </el-tooltip>
                </div>
              </el-card>
            </a>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
  </section>
</template>

<style scoped></style>
