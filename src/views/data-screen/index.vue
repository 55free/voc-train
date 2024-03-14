<script lang="ts" setup>
import Header from './header.vue';
import LeftTop from './component/left-top.vue';
import LeftBottom from './component/left-bottom.vue';
import rightBottom from './component/right-bottom.vue';
import rightTop from './component/right-top.vue';
import centerMap from './component/center-map.vue';
import { toast } from '@/utils/toast';
import { getBigScreenData, ScreenData } from '@/api/modules/big_screen';
import { getAreaIdList } from '@/api/modules/login';
const screenData = reactive<ScreenData>({
  teacherNum: 0,
  studentNum: 0,
  vodNum: 0,
  expNum: 0,
  examNum: 0,
  gradeNum: 0,
  teacherTotalHour: 0,
  studentTotalHour: 0,
  userAreaVOS: [],
  studentHours: [],
  teacherHours: [],
  gradeAnalysisVOS: [],
});
const areaCodeList = ref([]);
getBigScreenData().then((res) => {
  let data = res.data;
  for (let key in data) {
    screenData[key] = data[key];
  }
});
getAreaIdList().then((res) => {
  areaCodeList.value = res.data;
});
onMounted(() => {
  const clientHeight = window.innerWidth;
  if (clientHeight < 1870) {
    toast({
      message: `你的浏览器窗口宽度为${clientHeight}，建议调整宽度>1920打开`,
      type: 'warning',
    });
  }
});
</script>

<template>
  <div class="content_wrap">
    <Header />
    <div class="index-wrap" text-blue>
      <div class="content-left">
        <LeftTop v-bind="screenData" class="!w-[550px]" />
        <LeftBottom v-bind="screenData" class="!w-[550px]" />
      </div>
      <div class="content-center">
        <centerMap
          :area-data="screenData.userAreaVOS"
          :code-list="areaCodeList"
        />
      </div>
      <div class="content-right">
        <rightTop v-bind="screenData" />
        <rightBottom v-bind="screenData" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content_wrap {
  width: 100%;
  height: 100vh;
  padding: 16px 16px 16px 16px;
  box-sizing: border-box;
  background-image: url('@/assets/images/data-screen/pageBg.png');
  background-size: cover;
  background-position: center center;
  overflow: auto;
}

.index-wrap {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}
.content-left,
.content-right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  max-width: 540px;
  box-sizing: border-box;
  flex-shrink: 0;
}
.content-center {
  min-width: 700px;
  margin: 0 54px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
