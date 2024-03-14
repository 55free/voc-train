<script lang="ts" setup>
import {
  requestExpListCard,
  IExpCard,
  IExpType,
  requestExpTypeList,
} from '@/api/modules/experiment';
import type { requestWithPage } from '@/types/reqOptions';
import { getCharge, getLevel } from '@/utils/level';
const selected = ref(0);
let requestParams = reactive<requestWithPage>({
  // recommend: 1,
  pageSize: 10,
  pageNum: 1,
  expType: undefined,
});
const total = ref(0);
const cardList = ref<IExpCard[]>([]);
const categoryList = ref<IExpType[]>([
  {
    typeName: '全部分类',
    typeCode: '0',
    objId: undefined,
  },
]);
const getExpTypeList = () => {
  requestExpTypeList().then((res) => {
    categoryList.value.push(...res.data);
  });
};
const getCardList = () => {
  requestExpListCard(requestParams).then((res) => {
    cardList.value = res.rows;
    total.value = res.total;
  });
};
const handlePageChange = (val: number) => {
  requestParams.pageNum = val;
  // pageOptions.pageNum = val;
  getCardList();
};
function handleQuery() {
  requestParams.pageNum = 1;
  getCardList();
}

getExpTypeList();
getCardList();
function tabClick({ index }: any) {
  selected.value = index;
  requestParams.expType = categoryList.value[index].objId;
  handleQuery();
}
</script>

<template>
  <div class="w-4/5 mx-auto 2xl:w-3/4">
    <div class="flex items-center mb-4">
      <el-button round type="primary" class="button" color="#0066ff"
        >开始实验</el-button
      >
      <!-- <el-image
        src="@/assets/images/shiyan.png"
        style="width: 300px"
        fit="contain"
      ></el-image> -->
      <img src="@/assets/images/shiyan.png" class="w-350px" />
    </div>
    <el-tabs @tab-click="tabClick">
      <template v-for="item of categoryList" :key="item.key">
        <!-- <el-tab-pane :lazy="true" class="flex flex-wrap p-8"> -->
        <el-tab-pane
          :lazy="true"
          class="grid grid-cols-2 gap-8 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <template #label>
            <span class="text-xl font-700">{{ item.typeName }}</span>
          </template>
          <template v-for="card in cardList" :key="card.objId">
            <a :href="card.expAddress" target="_blank">
              <el-card :body-style="{ padding: '0px' }" class="w-300px p-4">
                <img :src="card.expPic" class="w-250px" />
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
      <div class="flex justify-center mt-8">
        <el-pagination
          background
          :page-size="requestParams.pageSize"
          :current-page="requestParams.pageNum"
          layout="prev, pager, next"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </el-tabs>
  </div>
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
