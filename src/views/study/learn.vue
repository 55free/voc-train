<script lang="ts" setup>
import catalog from './components/catalog.vue';
import intro from './components/intro.vue';
import Player from 'xgplayer';
import { ElMessage, ElMessageBox } from '@/utils/toast';
import {
  requestCourseDetail,
  ICourseDetail,
  postStudyCount,
} from '@/api/modules/study';
import { useDictStore } from '@/store/dict';
import 'element-plus/es/components/message-box/style/css';

import {
  VideoPlay,
  Star,
  ChatDotSquare,
  Edit,
  Share,
  Plus,
} from '@element-plus/icons-vue';
const id = useRoute().params.id;
const { courseLabelDict, courseChargeDict, courseDifficultyDict } =
  useDictStore();
const resource = reactive({
  name: '',
  id: 0,
  children: [
    {
      name: '',
      url: '',
      duration: 0,
    },
  ],
});
let myplayer: Player = null;
const selected = ref(0);
const selectedVideo = ref(0);
const categoryList = ref([
  {
    name: '课程介绍',
    id: 0,
  },
]);
const courseDetail = reactive<ICourseDetail>({
  objId: 0,
  courseName: '',
  courseDifficulty: 0,
  deptName: '',
  courseHour: '',
  courseCharge: '',
  courseDescription: '',
  courseTag: '',
  coursePic: '',
  studyCount: 0,
  updateTime: '',
  coursePrice: 0,
  voList: [],
});
const videoUrl = ref('');

const initVideoPlayer = () => {
  myplayer = new Player({
    id: 'mse',
    lang: 'zh',
    // 默认静音
    // volume: 0,
    autoplay: false,
    screenShot: true,
    videoAttributes: {
      crossOrigin: 'anonymous',
    },
    width: '838px',
    height: '560px',
    url: videoUrl.value,
    // poster: courseDetail.coursePic,

    //传入倍速可选数组
    playbackRate: [0.5, 0.75, 1, 1.5, 2],
  });
  console.log('myplayer', myplayer);
};
const initVideoList = () => {
  resource.name = courseDetail.courseName;
  resource.id = courseDetail.objId;
  resource.children = courseDetail.voList.map((item) => {
    return {
      name: item.vcChapterName,
      url: item.url,
      duration: item.duration,
    };
  });
};
function tabClick({ index }: any) {
  console.log('index', index);
}
defineOptions({
  name: 'StudyInfo',
});
requestCourseDetail(id as string).then((res) => {
  const data = res.data;
  for (const key in data) {
    courseDetail[key] = data[key];
  }
  videoUrl.value = courseDetail.voList[0]?.url;
  initVideoPlayer();
  initVideoList();
});
postStudyCount(id as string);
// onMounted(() => {
//   initVideoPlayer();
// });
const open = () => {
  ElMessageBox.prompt('切换视频地址', 'Tip', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
    .then(({ value }) => {
      myplayer.switchURL(value);
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '输入取消',
      });
    });
};
const handleVideoClick = (index: number) => {
  selectedVideo.value = index;
  videoUrl.value = resource.children[index].url;
  // myplayer.switchURL(videoUrl.value);
  myplayer.playNext({ url: videoUrl.value });
};
</script>

<template>
  <div
    class="w-1200px h-560px mx-auto flex flex-row bg-#1b2128 overflow-y-hidden relative"
  >
    <!-- <div class="absolute right-0 top-2">
      <el-button text @click="open">切换视频地址</el-button>
    </div> -->
    <div>
      <div id="mse" />
      <!-- <div class="height-68px p-6 color-#8797a1 w-full flex items-center">
        <el-button :icon="Star" type="info" round>收藏</el-button>
        <el-button :icon="ChatDotSquare" type="info" round>咨询</el-button>
        <p class="course-opbar-slash"></p>
        <span class="flex items-center mr-4">
          <el-icon><Edit /></el-icon>评价
        </span>

        <span class="flex items-center">
          <el-icon><Share /></el-icon>分享
        </span>
      </div> -->
    </div>
    <div class="player-aside ml-4 text-#c0c5cc flex flex-col w-360px">
      <div
        class="h-48px flex items-center bg-#1b2128 border-b-2 border-solid border-#1b2128"
      >
        <p>目录({{ courseDetail.voList.length }})</p>
      </div>
      <el-scrollbar height="520px">
        <div class="catalogue" flex flex-col>
          <ul class="wrapper mt-8 text-left">
            <p class="text-base">{{ resource.name }}</p>
            <li
              v-for="(item, index) in resource.children"
              :key="item.url"
              class="flex"
            >
              <div
                :class="{ 'selected-video': selectedVideo === index }"
                class="flex items-center p-4 text-sm w-full rounded-md cursor-pointer hover:text-#2080f7 hover:bg-#0f1419"
                @click="handleVideoClick(index)"
              >
                <VideoPlay style="width: 1rem; height: 1rem" />

                <div class="ml-4 text-left">
                  <p>{{ item.name }}</p>
                  <p class="text-sm">{{ item.duration }}分钟</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <section class="title w-1200px mx-auto mt-4 py-4">
    <div class="wrap-info flex items-center justify-between">
      <div class="course-info">
        <h3 class="course-title text-2xl my-3">
          【{{ courseDifficultyDict[courseDetail.courseDifficulty] }}】{{
            courseDetail.courseName
          }}
        </h3>
        <p class="course-hints flex items-center">
          <span
            v-if="courseDetail.courseCharge === '2'"
            class="course-price text-xl text-#ff7a38 font-900 leading-8"
            >{{ courseChargeDict[courseDetail.courseCharge] + '：'
            }}{{ '¥ ' + courseDetail.coursePrice }}</span
          >
          <span
            v-if="courseDetail.courseCharge === '1'"
            class="course-price text-xl text-green font-900 leading-8"
            >{{ courseChargeDict[courseDetail.courseCharge] }}</span
          >
          <span class="course-nums ml-4 color-#667280"
            ><span>{{ courseDetail.studyCount }}</span
            >人累计学习<!-- --></span
          >
        </p>
      </div>
      <!-- <div class="course-action">
        <el-button
          class="!px-20 !py-6 text-xl"
          type="primary"
          size="large"
          round
          color="#1e79e9"
          :icon="Plus"
          >立即报名</el-button
        >
      </div> -->
    </div>
  </section>
  <!-- <section class="intro bg-#f5f8fa pt-10 dark:text-light dark:bg-#1b2128">
    <el-card class="w-1200px mx-auto">
      <el-tabs v-model="selected" @tab-click="tabClick">
        <template v-for="item of categoryList" :key="item.key">
          <el-tab-pane :lazy="true" :name="item.id" class="flex flex-wrap">
            <template #label>
              <span class="text-xl font-700">{{ item.name }}</span>
            </template>
            <intro v-if="selected === 0" />
            <catalog v-if="selected === 1" />
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-card>
  </section> -->
</template>

<style lang="scss" scoped>
.course-opbar-slash {
  border: 1px solid #323c46;
  height: 12px;
  width: 0;
  margin: 0 24px;
}
:deep(.el-tabs__nav-wrap::after) {
  width: 0;
}
:deep(.el-sub-menu__title) {
  background: #f5f8fa;
}
@media (prefers-color-scheme: dark) {
  :deep(.el-sub-menu__title) {
    background: #333; // 你的深色模式背景色
  }
}
:deep(.el-menu-item) {
  border-bottom: 1px solid #f6f7f8;
  height: 60px;
}
.selected-video {
  background: #1b2128;
  color: #2080f7;
}
</style>
