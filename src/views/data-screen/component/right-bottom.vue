<script setup lang="ts">
import { reactive, ref } from 'vue';
import itemWrap from './item-wrap.vue';
import { ScreenData } from '@/api/modules/big_screen';
const props = defineProps<ScreenData>();

const duration = ref(2);
const state = reactive({
  alarmNum: 759,
  offlineNum: 44,
  onlineNum: 654,
  totalNum: 698,
});

// const getData = () => {
//   currentGET('leftTop').then((res) => {
//     console.log(res);
//     if (res.success) {
//       state.alarmNum = res.data.alarmNum;
//       state.offlineNum = res.data.offlineNum;
//       state.onlineNum = res.data.onlineNum;
//       state.totalNum = res.data.totalNum;
//     }
//   });
// };
// getData();
</script>

<template>
  <itemWrap title="综合统计分析" class="!h-520px">
    <ul class="user_Overview flex flex-wrap">
      <li class="user_Overview-item" style="color: #00fdfa">
        <div class="user_Overview_nums allnum">
          {{ props.teacherNum }}
        </div>
        <p>教师数量</p>
      </li>
      <li class="user_Overview-item" style="color: #07f7a8">
        <div class="user_Overview_nums online">
          {{ props.studentNum }}
        </div>
        <p>学员数量</p>
      </li>
      <li class="user_Overview-item" style="color: #e3b337">
        <div class="user_Overview_nums offline">
          {{ props.vodNum }}
        </div>
        <p>视频数量</p>
      </li>
      <li class="user_Overview-item" style="color: #f5023d">
        <div class="user_Overview_nums laramnum">
          {{ props.examNum }}
        </div>
        <p>试卷数量</p>
      </li>
      <li class="user_Overview-item" style="color: #00fdfa">
        <div class="user_Overview_nums allnum">
          {{ props.teacherTotalHour }}
        </div>
        <p>教师课时</p>
      </li>
      <li class="user_Overview-item" style="color: #07f7a8">
        <div class="user_Overview_nums online">
          {{ props.studentTotalHour }}
        </div>
        <p>学员课时</p>
      </li>
      <li class="user_Overview-item" style="color: #e3b337">
        <div class="user_Overview_nums offline">
          {{ props.expNum }}
        </div>
        <p>累计实验</p>
      </li>
      <li class="user_Overview-item" style="color: #f5023d">
        <div class="user_Overview_nums laramnum">
          {{ props.gradeNum }}
        </div>
        <p>累计考试</p>
      </li>
    </ul>
  </itemWrap>
</template>

<style scoped lang="scss">
.left-top {
  width: 100%;
  height: 100%;
}

.user_Overview {
  li {
    flex: 1 0 25%;

    p {
      text-align: center;
      height: 16px;
      font-size: 16px;
    }

    .user_Overview_nums {
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      font-size: 22px;
      margin: 50px auto 30px;
      background-size: cover;
      background-position: center center;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      &.bgdonghua::before {
        animation: rotating 14s linear infinite;
      }
    }

    .allnum {
      &::before {
        background-image: url('@/assets/images/data-screen/left_top_lan.png');
      }
    }

    .online {
      &::before {
        background-image: url('@/assets/images/data-screen/left_top_lv.png');
      }
    }

    .offline {
      &::before {
        background-image: url('@/assets/images/data-screen/left_top_huang.png');
      }
    }

    .laramnum {
      &::before {
        background-image: url('@/assets/images/data-screen/left_top_hong.png');
      }
    }
  }
}
</style>
