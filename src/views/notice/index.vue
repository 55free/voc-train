<script lang="ts" setup>
import {
  getNoticeList,
  NoticePiece,
  getPageNoticeDict,
} from '@/api/modules/notice';
import { ArrowLeft, Search } from '@element-plus/icons-vue';
const showPaper = ref(false);
const noticeList = ref<NoticePiece[]>([]);
const paper = ref<NoticePiece>();
const categoryList = ref([{ dictSort: 0, dictLabel: '全部分类' }]);
const tabsValue = ref(0);
const total = ref(0);
const paperInput = ref('');
const requestParams = ref<{
  noticeType?: number;
  pageNum: number;
  pageSize: number;
  noticeTitle?: string;
}>({
  pageNum: 1,
  pageSize: 10,
});
// let pageOptions = reactive({
//   pageSize: 10,
//   pageNum: 1,
//   totals: 0,
// });
const getList = () => {
  getNoticeList(requestParams.value).then((res) => {
    noticeList.value = res.rows;
    // pageOptions.totals = res.total;
    total.value = res.total;
  });
};
getList();
getPageNoticeDict().then((res) => {
  categoryList.value.push(...res.rows);
});

const handlePageChange = (val: number) => {
  requestParams.value.pageNum = val;
  // pageOptions.pageNum = val;
  getList();
};

const handleTitleClick = (notice: NoticePiece) => {
  showPaper.value = true;
  paper.value = notice;
};
const handleChange = (val: string) => {
  requestParams.value.noticeTitle = val;
  handleQuery();
};

watch(tabsValue, (val) => {
  requestParams.value.noticeType = val === 0 ? undefined : val;
  handleQuery();
});

function handleQuery() {
  requestParams.value.pageNum = 1;
  getList();
}
</script>

<template>
  <div class="w-4/5 max-w-[1000px] mx-auto">
    <template v-if="!showPaper">
      <div class="flex bg-[#e5e5e5] mb-6 justify-between items-center">
        <p class="text-2xl">公告{{ noticeList.length }}条</p>
        <el-input
          v-model="paperInput"
          class="w-50 m-2"
          size="large"
          placeholder="请输入关键字"
          :prefix-icon="Search"
          @input="handleChange"
        />
      </div>
      <el-tabs v-model="tabsValue" tab-position="left" type="card">
        <el-tab-pane
          v-for="item in categoryList"
          :key="item.dictSort"
          :label="item.dictLabel"
          :name="item.dictSort"
        >
          <div
            class="grid grid-cols-1 divide-y-2 divide-solid mx-6 divide-gray-200 border-y-2 border-solid border-gray-200 basis-4/5"
          >
            <div
              v-for="notice in noticeList"
              :key="notice.noticeId"
              class="py-2 flex justify-between text-sm article hover:text-blue hover:cursor-pointer"
              @click="handleTitleClick(notice)"
            >
              <span> {{ notice.noticeTitle }} </span>
              <span> {{ notice.createTime }} </span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
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
    </template>
    <div v-else class="text-center">
      <h3>{{ paper.noticeTitle }}</h3>
      <div class="flex justify-between">
        <div
          class="flex items-center cursor-pointer"
          @click="showPaper = false"
        >
          <el-icon>
            <arrow-left @click="showPaper = false" />
          </el-icon>
          <span>返回</span>
        </div>
        <p class="text-right text-gray">发布时间：{{ paper.createTime }}</p>
      </div>
      <el-divider />
      <div v-html="paper.noticeContent"></div>
    </div>
  </div>
</template>

<style scoped>
/* 第一个article类 color红色 */
/* .article:nth-child(1) {
  color: #dc2828;
  border-bottom: 1px solid #dc2828ed;
} */
:deep(.el-tabs__item) {
  padding: 8px 40px;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
}
</style>
