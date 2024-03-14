<script lang="ts" setup>
import { useDictStore } from '@/store/dict';
import { storeToRefs } from 'pinia';
import type { requestWithPage } from '@/types/reqOptions';
import { IFinishedExam, getMyExamList } from '@/api/modules/exam';
import { isEmpty } from '@/utils/helper';

const store = useDictStore();
const { examDict } = storeToRefs(store);

const cardList = ref<IFinishedExam[]>([]);
let requestParams = reactive<requestWithPage>({
  pageSize: 10,
  pageNum: 1,
});
let pageOptions = reactive({
  pageSize: 10,
  pageNum: 1,
  totals: 0,
});
isEmpty(examDict) && store.getExamDict();

const getCardList = () => {
  getMyExamList(requestParams).then((res) => {
    cardList.value = res.rows;
    pageOptions.totals = res.total;
  });
};

const handlePageChange = (val: number) => {
  requestParams.pageNum = val;
  // pageOptions.pageNum = val;
  getCardList();
};

getCardList();

function refreshParams() {
  requestParams = {
    pageSize: 10,
    pageNum: 1,
  };
  pageOptions = {
    pageSize: 10,
    pageNum: 1,
    totals: 0,
  };
}
</script>

<template>
  <div>
    <div
      class="w-4/5 mx-auto 2xl:w-3/4 grid grid-cols-3 gap-8 xl:grid-cols-4 2xl:grid-cols-5"
    >
      <template v-for="card in cardList" :key="card.gradeId">
        <router-link :to="`/exam/finished/${card.gradeId}`">
          <el-card
            :body-style="{ width: '100% ' }"
            class="flex flex-wrap justify-center max-w-[310px]"
          >
            <img :src="card.imagePath" class="card-image" />
            <div>
              <p class="font-black">{{ card.examName }}</p>
              <p>
                分数：<span class="text-red">{{ card.grdScore }}</span>
              </p>
              <p class="text-gray-300">{{ card.grdStartTime }}完成考试</p>
            </div>
          </el-card>
        </router-link>
      </template>
    </div>

    <div class="flex justify-center mt-8">
      <el-pagination
        background
        :page-size="pageOptions.pageSize"
        :current-page="pageOptions.pageNum"
        layout="prev, pager, next"
        :total="pageOptions.totals"
        @current-change="handlePageChange"
      />
    </div>
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
