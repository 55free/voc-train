<script lang="ts" setup>
import Player from 'xgplayer';
import { ElMessage, ElMessageBox } from '@/utils/toast';
import { requestPlayBackList, ILiveRoomContent } from '@/api/modules/live';

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

const selectedVideo = ref(0);

const playBackDetail = reactive<ILiveRoomContent>({
  objId: 0,
  courseName: '',
  courseType: 0,
  courseCategory: 0,
  courseDifficulty: 0,
  courseCharge: '',
  teacherName: '',
  courseDescription: '',
  courseTag: '',
  coursePic: '',
  deptName: '',
  streamViewr: 0,
  vcUrl: null,
  thirdUrl: '',
  pullUrl: '',
  backUpUrlList: [],
  steamBeginTime: '',
  steamEndTime: '',
  courseMode: 0,
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
    height: '472px',
    url: videoUrl.value,
    // poster: playBackDetail.coursePic,

    //传入倍速可选数组
    playbackRate: [0.5, 0.75, 1, 1.5, 2],
  });
  console.log('myplayer', myplayer);
};
const initVideoList = () => {
  resource.name = playBackDetail.courseName;
  resource.id = playBackDetail.objId;
  resource.children = playBackDetail.backUpUrlList.map((item, index) => {
    return {
      name: (index + 1).toString(),
      url: item,
    };
  });
};
defineOptions({
  name: 'PlayBack',
});
requestPlayBackList(id as string).then((res) => {
  const data = res.data;
  for (const key in data) {
    playBackDetail[key] = data[key];
  }
  (videoUrl.value = playBackDetail.backUpUrlList.length
    ? playBackDetail.backUpUrlList[0]
    : ''),
    initVideoPlayer();
  initVideoList();
});
// onMounted(() => {
//   initVideoPlayer();
// });
// const open = () => {
//   ElMessageBox.prompt('切换视频地址', 'Tip', {
//     confirmButtonText: '确认',
//     cancelButtonText: '取消',
//   })
//     .then(({ value }) => {
//       myplayer.switchURL(value);
//     })
//     .catch(() => {
//       ElMessage({
//         type: 'info',
//         message: '输入取消',
//       });
//     });
// };
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
      <div class="height-68px p-6 color-#8797a1 w-full flex items-center">
        <el-button :icon="Star" type="info" round>收藏</el-button>
        <el-button :icon="ChatDotSquare" type="info" round>咨询</el-button>
        <p class="course-opbar-slash"></p>
        <span class="flex items-center mr-4">
          <el-icon><Edit /></el-icon>评价
        </span>

        <span class="flex items-center">
          <el-icon><Share /></el-icon>分享
        </span>
      </div>
    </div>
    <div class="player-aside ml-4 text-#c0c5cc flex flex-col w-360px">
      <div
        class="h-48px flex items-center bg-#1b2128 border-b-2 border-solid border-#1b2128"
      >
        <p>目录({{ playBackDetail.backUpUrlList.length }})</p>
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
          {{ playBackDetail.courseName }}
        </h3>
        <p class="course-hints flex items-center">
          <span class="course-nums ml-4 color-#667280"
            ><span>{{ playBackDetail.streamViewr }}</span
            >人累计看过<!-- --></span
          >
        </p>
      </div>
    </div>
  </section>
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
