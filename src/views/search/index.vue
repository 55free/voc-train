<script lang="ts" setup>
import { Right } from '@element-plus/icons-vue';
import {
  requestWareListCard,
  ISearchWareCard,
  requestCourseListCard,
  ISearchCourseCard,
  requestExpListCard,
  ISearchExpCard,
} from '@/api/modules/search';

import { getLevel, getCharge } from '@/utils/level';
const searchVaule = useRoute().params.input as string;

const courseList = ref<ISearchCourseCard[]>([]);
const WareList = ref<ISearchWareCard[]>([]);
const expList = ref<ISearchExpCard[]>([]);
// 根据不同的列表 生成不同的分页
const pageParams = reactive({
  course: {
    pageNum: 1,
    pageSize: 10,
    showPage: false,
  },
  ware: {
    pageNum: 1,
    pageSize: 10,
    showPage: false,
  },
  exp: {
    pageNum: 1,
    pageSize: 10,
    showPage: false,
  },
});

requestWareListCard({ cwName: searchVaule }).then((res) => {
  WareList.value = res.rows;
  pageParams.ware.showPage = res.total > 10;
});
requestCourseListCard({ courseName: searchVaule }).then((res) => {
  courseList.value = res.rows;
  pageParams.course.showPage = res.total > 10;
});
requestExpListCard({ expName: searchVaule }).then((res) => {
  expList.value = res.rows;
  pageParams.exp.showPage = res.total > 10;
});
</script>

<template>
  <section v-if="courseList.length > 0" class="relative mt-10 mx-30">
    <div class="flex justify-between mb-4">
      <div class="flex top-2 text-2xl">
        <img
          src="@/assets/svg/medal-sport.svg"
          class="w-6 h-6"
          mode="scaleToFill"
        />
        <h2>教学课程</h2>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-8 xl:grid-cols-4 2xl:grid-cols-5">
      <template v-for="course in courseList" :key="course.objId">
        <router-link :to="{ name: 'StudyInfo', params: { id: course.objId } }">
          <el-card :body-style="{ padding: '0px' }" class="w-300px p-4">
            <img :src="course.coursePic" class="w-270px h-160px" />
            <div>
              <span class="font-700">{{ course.courseName }}</span>
              <!-- 描述 -->
              <el-tooltip :content="course.courseDescription">
                <div
                  class="text-ellipsis text-gray-500 text-sm rounded bg-gray-100 p-2 my-4"
                  style="
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                  "
                >
                  {{ course.courseDescription }}
                </div>
              </el-tooltip>
              <div class="bottom flex items-center justify-between mb-4">
                <span
                  >{{ getLevel(course.courseDifficulty) }} ·{{
                    course.studyCount
                  }}
                  人学过</span
                >
              </div>
            </div>
          </el-card>
        </router-link>
      </template>
    </div>
  </section>
  <section v-if="WareList.length > 0" class="relative mt-10 mx-30">
    <div class="flex justify-between mb-4">
      <div class="flex top-2 text-2xl">
        <img
          src="@/assets/svg/medal-sport.svg"
          class="w-6 h-6"
          mode="scaleToFill"
        />
        <h2>课件查看</h2>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-8 xl:grid-cols-4 2xl:grid-cols-5">
      <template v-for="ware in WareList" :key="ware.objId">
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
    </div>
  </section>
  <section v-if="expList.length > 0" class="relative mt-10 mx-30">
    <div class="flex justify-between mb-4">
      <div class="flex top-2 text-2xl">
        <img
          src="@/assets/svg/medal-sport.svg"
          class="w-6 h-6"
          mode="scaleToFill"
        />
        <h2>虚拟实验</h2>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-8 xl:grid-cols-4 2xl:grid-cols-5">
      <template v-for="exp in expList" :key="exp.objId">
        <a :href="exp.expAddress" target="_blank">
          <el-card :body-style="{ padding: '0px' }" class="w-300px p-4">
            <img :src="exp.expPic" class="w-250px" />
            <div>
              <span class="font-700">{{ exp.expName }}</span>
              <div class="bottom flex items-center justify-between mb-4">
                <span
                  >{{ getLevel(exp.expDifficulty) }} ·
                  {{ getCharge(exp.expCharge) }}</span
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
              <el-tooltip :content="exp.expDescription">
                <p
                  class="text-ellipsis whitespace-nowrap overflow-hidden text-gray-500 text-sm"
                >
                  {{ exp.expDescription }}
                </p>
              </el-tooltip>
            </div>
          </el-card>
        </a>
      </template>
    </div>
  </section>
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
