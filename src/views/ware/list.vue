<script lang="ts" setup>
import { IChannelCard, getCourseWareListCard } from '@/api/modules/welcome';
import type { requestWithPage } from '@/types/reqOptions';
import { getCharge, getLevel } from '@/utils/level';
const selected = ref(0);
let requestParams = reactive<requestWithPage>({
  pageSize: 10,
  pageNum: 1,
});
const total = ref(0);
const courseWareList = ref<IChannelCard[]>([]);
const categoryList = ref([
  {
    typeName: '全部分类',
    typeCode: '0',
    objId: undefined,
  },
]);
const getCardList = () => {
  getCourseWareListCard(requestParams).then((res) => {
    courseWareList.value = res.rows;
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

getCardList();
function tabClick({ index }: any) {
  selected.value = index;
  requestParams.expType = categoryList.value[index].objId;
  handleQuery();
}
</script>

<template>
  <div class="w-4/5 mx-auto 2xl:w-3/4">
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
          <template v-for="ware in courseWareList" :key="ware.objId">
            <router-link :to="`/study/ware/${ware.objId}`">
              <el-card class="flex flex-wrap justify-center max-w-[310px]">
                <img :src="ware.cwPath" class="card-image mx-auto block" />
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
