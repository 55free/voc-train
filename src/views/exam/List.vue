<script lang="ts" setup>
import { useDictStore } from '@/store/dict';
import { storeToRefs } from 'pinia';
import type { requestWithPage } from '@/types/reqOptions';
import { isEmpty } from '@/utils/helper';
import {
  getExamCategory,
  IExamCategory,
  getExamCardList,
  IExamCard,
} from '@/api/modules/exam';

const store = useDictStore();
const { examDict } = storeToRefs(store);
const categoryList = ref<IExamCategory[]>([
  { objId: 0, typeName: '全部分类', typeCode: 0 },
]);
const cardList = ref<IExamCard[]>([]);
const total = ref(0);
let requestParams = reactive<requestWithPage>({
  // recommend: 1,
  pageSize: 10,
  pageNum: 1,
});
// let pageOptions = reactive({
//   pageSize: 10,
//   pageNum: 1,
//   totals: 0,
// });
isEmpty(examDict) && store.getExamDict();
getExamCategory().then((res) => {
  categoryList.value.push(...res.data);
});
const getCardList = () => {
  getExamCardList(requestParams).then((res) => {
    cardList.value = res.rows;
    total.value = res.total;
  });
};
const selected = ref(0);

function tabClick({ index }: any) {
  selected.value = index;
  requestParams.examType =
    categoryList.value[index].objId === 0
      ? undefined
      : categoryList.value[index].objId;
  handleQuery();
}

const handlePageChange = (val: number) => {
  requestParams.pageNum = val;
  // pageOptions.pageNum = val;
  getCardList();
};

getCardList();

function handleQuery() {
  requestParams.pageNum = 1;
  getCardList();
}
</script>

<template>
  <div class="w-4/5 mx-auto 2xl:w-3/4">
    <el-tabs @tab-click="tabClick">
      <template v-for="catg of categoryList" :key="catg.objId">
        <el-tab-pane
          :lazy="true"
          class="grid grid-cols-3 gap-8 xl:grid-cols-4 2xl:grid-cols-5"
        >
          <template #label>
            <span class="text-xl font-700">{{ catg.typeName }}</span>
          </template>
          <template v-for="card in cardList" :key="card.objId">
            <el-card
              :body-style="{ width: '100% ' }"
              class="flex flex-wrap justify-center max-w-[310px]"
            >
              <img :src="card.imagePath" class="card-image" />
              <div>
                <span class="font-700">{{ card.examName }}</span>
                <div class="bottom flex items-end justify-between">
                  <div>
                    <p>{{ examDict[card.examCategory] }}</p>
                    <p>{{ card.count }} 人考过</p>
                  </div>
                  <router-link :to="`/exam/detail/${card.objId}`">
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
:deep(.el-tabs__nav-wrap::after) {
  width: 0;
}
:deep(.el-tabs__header) {
  border-bottom: none;
}
</style>
