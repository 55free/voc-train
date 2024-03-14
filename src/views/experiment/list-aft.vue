<script lang="ts" setup>
import { useDictStore } from '@/store/dict';
import { storeToRefs } from 'pinia';
import type { requestWithPage } from '@/types/reqOptions';
import {
  getExamCategory,
  IExamCategory,
  getExamCardList,
  IExamCard,
} from '@/api/modules/exam';
import { isEmpty } from '@/utils/helper';

const store = useDictStore();
const { examDict } = storeToRefs(store);
const categoryList = ref<IExamCategory[]>([
  { objId: 0, typeName: '全部分类', typeCode: 0 },
  { objId: 1, typeName: 'Web前端开发', typeCode: 1 },
  { objId: 2, typeName: 'Linux运维', typeCode: 2 },
  { objId: 3, typeName: '信息安全', typeCode: 3 },
  { objId: 4, typeName: '数据库', typeCode: 4 },
]);
const cardList = ref<IExamCard[]>([]);
let requestParams = reactive<requestWithPage>({
  recommend: 1,
  pageSize: 10,
  pageNum: 1,
});
let pageOptions = reactive({
  pageSize: 10,
  pageNum: 1,
  totals: 0,
});
isEmpty(examDict) && store.getExamDict();
// getExamCategory().then((res) => {
//   categoryList.value.push(...res.data);
// });
const getCardList = () => {
  getExamCardList(requestParams).then((res) => {
    cardList.value = res.rows;
    pageOptions.totals = res.total;
  });
};
const selected = ref(0);

function tabClick({ index }: any) {
  refreshParams();
  selected.value = index;
  requestParams.examType =
    categoryList.value[index].objId === 0
      ? null
      : categoryList.value[index].objId;
  // getCardList();
}

const handlePageChange = (val: number) => {
  requestParams.pageNum = val;
  // pageOptions.pageNum = val;
  getCardList();
};

// getCardList();

function refreshParams() {
  requestParams = {
    recommend: 1,
    pageSize: 10,
    pageNum: 1,
  };
  pageOptions = {
    pageSize: 10,
    pageNum: 1,
    totals: 0,
  };
}
const expLink = [
  'https://edu.aliyun.com/lab/courses/08e02931dcaf4694b1ac7de93cd6560c/detail?spm=5176.11105637.0.0.c26a3a16PXHdRm',
  'https://edu.aliyun.com/lab/courses/018cdd6ce7ac4e219927bb44b5c5fd94/detail?spm=5176.11105637.0.0.c26a3a16PXHdRm',
  'https://edu.aliyun.com/lab/courses/285da179879f47ffa846d20bd8a5fecc/detail?spm=5176.11105637.0.0.c26a3a16PXHdRm',
  'https://edu.aliyun.com/lab/courses/75ce9f0ff9074db79e292872f9aaf11c/detail?spm=5176.11105637.0.0.c26a3a16PXHdRm',
  'https://edu.aliyun.com/lab/courses/a24ac94aa106481da372f2c21884ce03/detail?spm=5176.11105637.0.0.c26a3a16PXHdRm',
  'https://edu.aliyun.com/lab/courses/129136057c2a4d50af22490b5ce8f878/detail?spm=5176.11105637.0.0.c26a3a16PXHdRm',
  'https://edu.aliyun.com/lab/courses/ff257d990ade4980a36c79f6e39162d9/detail?spm=5176.11105637.0.0.c26a3a16PXHdRm',
  'https://edu.aliyun.com/lab/courses/fa551df19aab4cdda9f9efb056e48268/detail?spm=5176.11105637.0.0.c26a3a16PXHdRm',
  'https://edu.aliyun.com/lab/courses/646394e08b66441ab43f7a5e037a318e/detail?spm=5176.11105637.0.0.c26a3a16PXHdRm',
  'https://edu.aliyun.com/lab/courses/a0bb5c6142d94a0bbdce0bdfe60ddab9/detail?spm=5176.11105637.0.0.c26a3a16PXHdRm',
  'https://edu.aliyun.com/lab/courses/ade89abe2c4e4ecd825ab15b06e05de0/detail?spm=5176.11105637.0.0.c26a3a16PXHdRm',
];
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
          <template v-for="(item, i) in 10" :key="item">
            <a :href="expLink[i]" target="_blank">
              <el-card :body-style="{ padding: '0px' }" class="w-300px p-4">
                <img src="@/assets/images/qqTest.png" class="w-250px" />
                <div>
                  <span class="font-700">QQ机器人开发快速入门</span>
                  <div class="bottom flex items-center justify-around">
                    <span>初级 888 人学过</span>
                    <el-button
                      round
                      type="primary"
                      class="button"
                      color="#0066ff"
                      >开始实验</el-button
                    >
                  </div>
                </div>
              </el-card>
            </a>
          </template>
        </el-tab-pane>
      </template>
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
