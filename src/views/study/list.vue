<script lang="ts" setup>
import { useDictStore } from '@/store/dict';
import {
  requestCourseTypeList,
  requestCourseListCard,
  ICourseCard,
} from '@/api/modules/study';
import { getLevel } from '@/utils/level';
const dictStore = useDictStore();
interface CourseList {
  name: string;
  value?: string;
  data: { label: string; code: string | number }[];
}
const courseTags = reactive<CourseList[]>([
  {
    name: '方向',
    value: 'courseType',
    data: [
      {
        label: '全部',
        code: undefined,
      },
    ],
  },
  {
    name: '标签',
    value: 'courseLabel',
    data: [
      {
        label: '全部',
        code: undefined,
      },
    ],
  },
  // {
  //   name: '类型',
  //   value: 'courseCharge',
  //   data: [
  //     {
  //       label: '全部',
  //       code: undefined,
  //     },
  //   ],
  // },
  {
    name: '难度',
    value: 'courseDifficulty',
    data: [
      {
        label: '全部',
        code: undefined,
      },
    ],
  },
]);
const total = ref(0);
const courseList = ref<ICourseCard[]>([]);
const PageParams = reactive({
  page: 1,
  pageSize: 10,
});
const selectList = reactive(['综合']);
const selected = ref<(string | number | undefined)[]>([
  undefined,
  undefined,
  undefined,
]);

const getLabelDict = () => {
  dictStore.getCourseLabelDict().then((res) => {
    const labelList = res.map((item) => {
      return {
        label: item.dictLabel,
        // code: item.dictCode,
        code: item.dictValue,
      };
    });
    // 课程标签

    courseTags[1].data.push(...labelList);
  });
};

const getDifficultyDict = () => {
  dictStore.getCourseDifficultyDict().then((res) => {
    const difficultyList = res.map((item) => {
      return {
        label: item.dictLabel,
        code: item.dictValue,
      };
    });
    // 课程难度
    courseTags[2].data.push(...difficultyList);
  });
};
requestCourseTypeList().then((res) => {
  const mapData = res.data.map((item) => {
    return {
      label: item.typeName,
      code: item.objId,
    };
  });
  // 课程方向
  courseTags[0].data.push(...mapData);
});
const getCardList = () => {
  requestCourseListCard({
    courseType: selected.value[0],
    courseTag: selected.value[1],
    // courseCharge: selected.value[2],
    courseDifficulty: selected.value[2],
    pageNum: PageParams.page,
    pageSize: PageParams.pageSize,
  }).then((res) => {
    courseList.value = res.rows;
    total.value = res.total;
  });
};
const handlePageChange = (val: number) => {
  PageParams.page = val;
  getCardList();
};
function getTags(courseTag: string) {
  const tags = courseTag.split(',');
  return tags.map((tag) => {
    return dictStore.courseLabelDict[tag];
  });
}
function handleQuery() {
  PageParams.page = 1;
  getCardList();
}
watch(
  selected,
  (newVal) => {
    handleQuery();
  },
  { deep: true },
);

getLabelDict();
getDifficultyDict();
getCardList();
</script>

<template>
  <div class="mx-30 pt-4">
    <div class="course-nav bg-#f9f9f9 px-6 py-4 dark:bg-#1b2128">
      <el-card>
        <div
          v-for="(v, i) in courseTags"
          :key="v.name"
          class="category flex flex-wrap items-center"
        >
          <span class="start">{{ v.name + ': ' }}</span>
          <template v-for="item in v.data" :key="item.code"
            ><el-tag v-if="selected[i] === item.code" class="mx-4 my-2">
              {{ item.label }}
            </el-tag>
            <span
              v-else
              class="mx-4 my-2"
              @click="selected[i] = item.code as string"
            >
              {{ item.label }}
            </span>
          </template>
          <!-- 更多 -->
        </div>
      </el-card>
    </div>
    <el-card class="relative mt-4">
      <el-tabs>
        <el-tab-pane
          v-for="item of selectList"
          :key="item"
          :lazy="true"
          class="grid grid-cols-3 gap-8 xl:grid-cols-4 2xl:grid-cols-5"
        >
          <template #label>
            <span class="text-xl font-700">{{ item }}</span>
          </template>
          <template v-for="course in courseList" :key="course.objId">
            <router-link
              :to="{ name: 'StudyInfo', params: { id: course.objId } }"
            >
              <el-card :body-style="{ padding: '0px' }" class="w-full p-4">
                <div class="rounded-4 overflow-hidden h-160px">
                  <img :src="course.coursePic" class="w-full h-full" />
                </div>
                <div class="flex justify-between flex-col h-140px">
                  <div>
                    <p class="font-700 mb-2">{{ course.courseName }}</p>
                    <!-- 描述 -->
                    <el-tag
                      v-for="tag in getTags(course.courseTag)"
                      :key="tag"
                      class="mr-2"
                      type="info"
                      round
                      >{{ tag }}</el-tag
                    >
                    <p
                      v-if="course.courseCharge === '2'"
                      class="text-red-500 mt-2 text-xl"
                    >
                      ¥ {{ course.coursePrice }}元
                    </p>
                  </div>
                  <div class="bottom flex items-center justify-between">
                    <span class="text-gray-500"
                      >{{ getLevel(course.courseDifficulty) }} ·{{
                        course.studyCount
                      }}
                      人学过</span
                    >
                    <el-tag
                      v-if="course.courseCharge === '1'"
                      type="danger"
                      round
                      >免费</el-tag
                    >
                  </div>
                </div>
              </el-card>
            </router-link>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="flex justify-center mt-8">
        <el-pagination
          background
          :page-size="PageParams.pageSize"
          :current-page="PageParams.page"
          layout="prev, pager, next"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
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
