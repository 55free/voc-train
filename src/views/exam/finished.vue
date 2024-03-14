<script lang="ts" setup>
import {
  getFinishedDetail,
  IFinishedDetail,
  AnswerVOList,
} from '@/api/modules/exam';
import { useDictStore } from '@/store/dict';
import { storeToRefs } from 'pinia';

const examId = useRoute().params.id;
const examDetailInfo = ref<IFinishedDetail>({
  objId: 0,
  examName: '',
  startTime: '',
  endTime: '',
  examCategory: 0,
  grdResult: 0,
  userName: '',
  examTime: '',
  examUseTime: '',
  score: '',
  grdScore: '',
  answerVOList: [],
  grdMarker: null,
  grdMarkTime: null,
  grdMarkContent: null,
});
const { quesDict } = storeToRefs(useDictStore());
getFinishedDetail(parseInt(examId as string)).then((res) => {
  examDetailInfo.value = res.data;
});
</script>

<template>
  <div class="flex justify-center flex-col max-w-1000px mx-auto gap-8">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <p class="text-xl font-bold">{{ examDetailInfo.examName }}</p>
            <p class="text-gray">
              满分：{{ examDetailInfo.examTime }}分 所用时间：{{
                examDetailInfo.examUseTime
              }}分钟
            </p>
            <p class="text-gray">评卷人：{{ examDetailInfo.grdMarker }}</p>
            <p class="text-gray">评语：{{ examDetailInfo.grdMarkContent }}</p>
          </div>
          <div>
            <span class="text-red text-2xl"
              >{{ examDetailInfo.grdScore }}分</span
            >
          </div>
        </div>
      </template>
      <div
        v-for="(question, index) in examDetailInfo.answerVOList"
        :key="question.quesContent"
        class="mt-6"
      >
        <div class="flex items-center justify-between text-lg font-bold">
          <p>{{ index + 1 }}、{{ `(${quesDict[question.quesSort]})` }}</p>

          <p>{{ question.quesScore }}分</p>
        </div>
        <div v-html="question.quesContent"></div>
        <template v-if="question.quesSort !== 3">
          <div v-for="option in question.items" :key="option.content">
            <div class="flex my-2">
              {{ option.prefix + '：' }}
              <p v-html="option.content"></p>
            </div>
          </div>
        </template>
        <div class="flex items-center relative mark_answer">
          <div class="mr-8">我的答案：{{ question.answer }}</div>
          <div class="text-green">正确答案：{{ question.quesAnswer }}</div>
          <!-- 显示√,x -->
          <div
            v-if="question.answer === question.quesAnswer"
            class="text-green absolute right-4 text-2xl"
          >
            √
          </div>
          <div v-else class="text-red absolute right-4 text-2xl">X</div>
        </div>
        <!-- 题目解析  上下边框-->
        <div class="py-4">
          <p class="font-bold">题目解析：</p>
          <p v-html="question.analysis"></p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.mark_answer {
  min-height: 20px;
  padding: 16px 20px;
  margin-top: 16px;
  border: solid #f0f3f7 1px;
  border-left: 5px solid #e1e7f0;
  position: relative;
}
</style>
