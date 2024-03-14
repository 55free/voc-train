<script lang="ts" setup>
import { requestCourseTypeList } from '@/api/modules/study';
import {
  requestLiveCardList,
  ILiveCard,
  requestPlayBackList,
  requestLiveRoomContent,
  ILiveRoomContent,
} from '@/api/modules/live';
import { getCharge } from '@/utils/level';
const router = useRouter();
const categoryList = ref([
  {
    typeName: '全部分类',
    objId: undefined,
  },
]);

const requestParams = reactive({
  pageSize: 10,
  pageNum: 1,
  courseType: undefined,
  vcUrl: undefined,
});
const liveList = ref([
  {
    name: '直播',
    id: 0,
  },
  {
    name: '回看',
    id: 1,
  },
]);
const cardList = ref<ILiveCard[]>([]);
const getCourseTypeList = () => {
  requestCourseTypeList().then((res) => {
    categoryList.value.push(...res.data);
  });
};
const getCardList = () => {
  requestLiveCardList(requestParams).then((res) => {
    cardList.value = res.rows;
  });
};
const categoryIndex = ref(0);
const liveIndex = ref(0);
const handleQuery = () => {
  requestParams.pageNum = 1;
  getCardList();
};
const tabClick = ({ index }: any) => {
  categoryIndex.value = index;
  requestParams.courseType = categoryList.value[index].objId;
  handleQuery();
};
const liveTabClick = ({ index }: any) => {
  liveIndex.value = index;
  requestParams.vcUrl = liveList.value[index].id === 0 ? undefined : 1;
  handleQuery();
};

interface LiveStatus {
  // 在这里定义你的对象的属性
  type: 'success' | 'info' | 'warning' | 'danger';
  msg: string;
}
const getLiveStatus = (card: ILiveCard): LiveStatus => {
  // 获取当前时间,返回 还有多久时间开始,正在进行中,已结束
  // 时间格式为2024-03-07 00:00:00
  const result: LiveStatus = {
    type: 'info',
    msg: '',
  };
  const now = new Date().getTime();
  const startTime = new Date(card.steamBeginTime).getTime();
  const endTime = new Date(card.steamEndTime).getTime();
  if (now < startTime) {
    // 在1小时之内,返回剩余分钟树,否则返回剩余小时+分钟
    const time = (startTime - now) / 1000;
    if (time < 3600) {
      result.type = 'warning';
      result.msg = `${Math.floor(time / 60)}分钟后开始`;
    } else {
      result.type = 'warning';
      result.msg = `${Math.floor(time / 3600)}小时${Math.floor(
        (time % 3600) / 60,
      )}分钟后开始`;
    }
  } else if (now > startTime && now < endTime) {
    result.type = 'success';
    result.msg = '正在进行中';
  } else {
    result.type = 'danger';
    result.msg = '已结束';
  }
  return result;
};
const handleCardClick = (card: ILiveCard) => {
  // 如果courseMode === 1,跳转到直播页面,否则跳转到第三方连接
  // 如果vcUrl === 1,跳转到回看页面,否则跳转到第三方连接
  console.log(
    'requestParams.vcUrl',
    requestParams.vcUrl,
    'card.courseMode',
    card.courseMode,
    'card.thirdUrl',
    card.thirdUrl,
  );

  if (requestParams.vcUrl === 1 && card.courseMode === 1) {
    router.push({
      name: 'PlayBack',
      params: {
        id: card.objId,
      },
    });
  } else if (requestParams.vcUrl === 1 && card.courseMode === 2) {
    requestPlayBackList(card.objId.toString()).then((res) => {
      window.open(res.data.thirdUrl);
    });
    // window.open(card.thirdUrl);
  } else if (requestParams.vcUrl === undefined && card.courseMode === 1) {
    router.push({
      name: 'WebCourse',
      params: {
        id: card.objId,
      },
    });
  } else {
    requestLiveRoomContent(card.objId.toString()).then((res) => {
      window.open(res.data.thirdUrl);
    });
  }
};
getCourseTypeList();
getCardList();
</script>

<template>
  <div class="ml-20">
    <div class="course-header flex items-center text-xl font-600 mb-4">
      <template v-for="(v, index) in categoryList" :key="v.id">
        <el-button
          v-if="index === categoryIndex"
          :key="v.objId"
          color="#0066ff"
          class="mr-8 font-600"
          size="large"
          type="primary"
          round
          @click="tabClick({ index })"
        >
          {{ v.typeName }}
        </el-button>
        <p v-else class="mr-8" @click="tabClick({ index })">
          {{ v.typeName }}
        </p>
      </template>
    </div>
    <div class="course-header flex items-center text-xl font-600 mb-4">
      <template v-for="(v, index) in liveList" :key="v.id">
        <el-button
          v-if="v.id === liveIndex"
          :key="v.id"
          color="#0066ff"
          class="mr-8 font-600"
          size="large"
          type="primary"
          round
          @click="liveTabClick({ index })"
        >
          {{ v.name }}
        </el-button>
        <p v-else class="mr-8" @click="liveTabClick({ index })">
          {{ v.name }}
        </p>
      </template>
    </div>
    <div class="flex flex-wrap gap-6">
      <template v-for="card in cardList" :key="card.objId">
        <el-card
          :body-style="{ padding: '0px' }"
          class="w-300px p-4"
          @click="handleCardClick(card)"
        >
          <img :src="card.coursePic" class="w-270px h-160px" />
          <div class="flex justify-between flex-col h-140px">
            <div>
              <p class="font-700 mb-2">{{ card.courseName }}</p>
              <!-- 描述 -->
              <!-- <el-tag
                v-for="tag in getTags(card.cardTag)"
                :key="tag"
                class="mr-2"
                type="info"
                round
                >{{ tag }}</el-tag
              > -->
              <!-- <p
                v-if="card.courseCharge === '2'"
                class="text-red-500 mt-2 text-xl"
              >
                ¥ {{ card.cardPrice }}元
              </p> -->
              <el-tag :type="getLiveStatus(card).type" round>{{
                getLiveStatus(card).msg
              }}</el-tag>
            </div>
            <div class="bottom flex items-center justify-between">
              <span class="text-gray-500"
                >{{ getCharge(card.courseCharge) }} ·{{
                  card.streamViewr
                }}
                人看过</span
              >
              <el-tag v-if="card.courseCharge === '1'" type="danger" round
                >免费</el-tag
              >
            </div>
          </div>
        </el-card>
      </template>
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
</style>
