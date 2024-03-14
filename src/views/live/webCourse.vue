<script lang="ts" setup>
import Player from 'xgplayer';
import FlvPlayer from 'xgplayer-flv';
import { Plus, ChatDotRound, Handbag } from '@element-plus/icons-vue';
import { ElScrollbar } from 'element-plus';
import { ElMessage, ElMessageBox } from '@/utils/toast';
import {
  requestLiveRoomContent,
  ILiveRoomContent,
  IComment,
  requestLiveWord,
  uploadLiveWord,
} from '@/api/modules/live';
import 'element-plus/es/components/scrollbar/style/css';
const roomId = useRoute().params.id;
const roomInfo = reactive<ILiveRoomContent>({
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
  backUpUrlList: null,
  steamBeginTime: '',
  steamEndTime: '',
  courseMode: 0,
});
const chatArr = reactive<IComment[]>([]);
const lastWordId = ref(undefined);
const chatList = ref();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const itext = ref('');
const textAreaStyle = {
  height: 'calc(100vh - 460px)',
  background: '#222931',
};
let myplayer: Player = null;
// 初始化聊天列表
// for (let i = 0; i < 10; i++) {
//   chatArr.push({
//     id: i,
//     content: '新进入的同学，可以学习',
//   });
// }
const getLiveWord = () => {
  requestLiveWord(roomId as string, lastWordId.value).then((res) => {
    if (!res.data || res.data.length === 0) return;
    const data = res.data;
    lastWordId.value = data[data.length - 1].id;
    chatArr.push(...data);
    scrollbarRef.value!.setScrollTop(chatList.value.scrollHeight - 240);
  });
};
getLiveWord();

requestLiveRoomContent(roomId as string).then((res) => {
  const data = res.data;
  for (const key in data) {
    roomInfo[key] = data[key];
  }
  initPlayer();
});
const initPlayer = () => {
  myplayer = new Player({
    id: 'mse',
    isLive: true,
    playsinline: true,
    url: roomInfo.pullUrl,
    autoplay: true,
    height: '100%',
    width: '100%',
    plugins: [FlvPlayer],
    lang: 'zh-cn',
    playbackRate: [],
    // crossOrigin: true,
  });
};

onMounted(() => {
  setTimeout(() => {
    scrollbarRef.value!.setScrollTop(chatList.value.scrollHeight - 240);
  }, 3000);
  setInterval(() => {
    getLiveWord();
  }, 10 * 1000);
});
const open = () => {
  ElMessageBox.prompt('切换直播地址', 'Tip', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
    .then(({ value }) => {
      // myplayer.switchURL(value, true);
      myplayer.playNext({ url: value });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '输入取消',
      });
    });
};
const handleSend = () => {
  if (itext.value === '') {
    ElMessage({
      type: 'info',
      message: '请输入内容',
    });
    return;
  }
  uploadLiveWord(roomId as string, itext.value).then(() => {
    itext.value = '';
    getLiveWord();
  });
};
</script>

<template>
  <div class="wrapper">
    <div class="header flex justify-between items-center">
      <div class="left flex gap-6 items-center">
        <div>
          <div class="ml-4">{{ roomInfo.courseName }}</div>
          <div class="ml-4 text-sm">教师：{{ roomInfo.teacherName }}</div>
        </div>
        <div>
          <span class="text-sm">{{ roomInfo.streamViewr }}人正在观看</span>
          <p class="text-sm">简介：{{ roomInfo.courseDescription }}</p>
        </div>
      </div>
      <p>
        直播时间：{{ roomInfo.steamBeginTime }}——{{ roomInfo.steamEndTime }}
      </p>
      <div class="right flex items-center gap-4 mr-6">
        <span>评价</span>
        <span>分享</span>
        <div class="flex items-center gap-2">
          <el-avatar
            size="small"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
        </div>
      </div>
    </div>
    <el-row class="text-light row-height">
      <el-col :xs="16" :sm="12" :md="16" :lg="16" :xl="20"
        ><div id="mse"
      /></el-col>
      <el-col :xs="8" :sm="12" :md="8" :lg="8" :xl="4">
        <div class="right-side-bar relative">
          <div class="absolute right-0 top-2">
            <el-button text @click="open">切换直播地址</el-button>
          </div>
          <div
            class="side-header h-60px leading-60px border-b-1 border-#ccc9 border-solid"
          >
            <p class="ml-6">讨论</p>
          </div>
          <div class="side-content">
            <div class="chat-wrap mr-4">
              <el-scrollbar ref="scrollbarRef" height="280px" always>
                <div ref="chatList" class="chat-list ml-6">
                  <div v-for="v in chatArr" :key="v.id" class="chat-item my-6">
                    <p
                      :class="{ 'text-#489': v.isSender }"
                      class="text-sm text-#ccc"
                    >
                      {{ `用户${v.id}` }}
                    </p>
                    <p :class="{ 'text-#489': v.isSender }">{{ v.msg }}</p>
                  </div>
                </div>
              </el-scrollbar>
            </div>
            <div class="text-editor text-#222931 relative">
              <div
                class="h-60px leading-60px border-y-2 border-#14171a border-solid px-6 flex justify-between items-center"
              >
                <el-icon color="#ccc" :size="20"><ChatDotRound /></el-icon>
                <el-icon color="#ccc" :size="20"><Handbag /></el-icon>
              </div>
              <el-input
                v-model="itext"
                type="textarea"
                placeholder=""
                :input-style="textAreaStyle"
              />
              <el-button
                type="primary"
                round
                class="absolute right-5 bottom-5"
                @click="handleSend"
                >发送</el-button
              >
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100vh;
  background: #1b2128;
  .row-height {
    height: calc(100vh - 60px);
  }
  .header {
    width: 100%;
    height: 60px;
    color: #8797a1;
    background: #1b2128;
    user-select: none;
    position: relative;
  }
}
</style>
