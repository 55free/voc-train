<!-- eslint-disable vue/no-v-html -->
<script lang="ts" setup>
import {
  getQuizState,
  IQuizState,
  getQuizQuestions,
  IQuizPaper,
  endExam,
  uploadAnswer,
} from '@/api/modules/exam';
import { isEmpty } from '@/utils/helper';
const ExamId = useRoute().params.id;
const router = useRouter();
const isContinue = ref(false);
const questions = ref<IQuizPaper[]>([]);
const currentQuestionIndex = ref(0);
const gradeId = ref(0);

let quizState = reactive<IQuizState>({
  objId: 0,
  userName: '',
  grdResult: null,
  grdExam: 0,
  examName: '',
  score: '',
  grdScore: null,
  examTime: '',
  grdStartTime: '',
  grdFinishTime: null,
});
getQuizState(parseInt(ExamId as string))
  .then((res) => {
    quizState = res.data;
    gradeId.value = quizState.objId;
    // quizState.grdStartTime为考试开始时间 格式为 2021-09-01 00:00:00
    // 与当前时间作对比, 在10秒之内,则为开始考试状态,否则为继续考试状态
    const startTime = new Date(quizState.grdStartTime).getTime();
    const currentTime = new Date().getTime();
    if (currentTime - startTime < 10000) {
      isContinue.value = false;
    } else {
      isContinue.value = true;
    }
    return quizState.objId;
  })
  .then((quizId) => {
    getQuizQuestions({ quizId }).then((res) => {
      questions.value = res.rows;
      if (questions.value.length < res.total) {
        // 继续请求, 直到获取所有题目
        getQuizQuestions({ quizId, pageNum: 1, pageSize: res.total }).then(
          (res) => {
            questions.value = res.rows;
          },
        );
      }
      initAnswer();
    });
  });

function prevQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
}
function nextQuestion(i: number) {
  // 上传上一个问题的答案
  // if (questions.value[i].quesSort === 2) {
  //   questions.value[i].answer = questions.value[i].answer.join(',');
  // }
  // if (!isEmpty(questions.value[i].answer)) {
  //   // 上传答案
  //   uploadAnswer({
  //     gradeId: gradeId.value,
  //     paperId: questions.value[i].paperId,
  //     answer: questions.value[i].answer,
  //   });
  // }
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
}

// 监听currentQuestionIndex的变化, 上传答案
watch(currentQuestionIndex, (newIndex, oldIndex) => {
  if (oldIndex !== undefined) {
    if (questions.value[oldIndex].quesSort === 2) {
      questions.value[oldIndex].answer =
        questions.value[oldIndex].answer.join(',');
    }
    if (!isEmpty(questions.value[oldIndex].answer)) {
      // 上传答案
      uploadAnswer({
        gradeId: gradeId.value,
        paperId: questions.value[oldIndex].paperId,
        answer: questions.value[oldIndex].answer,
      });
    }
  }
});

function initAnswer() {
  // 对每个问题初始化答案
  questions.value.forEach((question) => {
    if (question.quesSort === 2) {
      question.answer = question.answer ? question.answer : [];
    } else {
      question.answer = question.answer ? question.answer : '';
    }
  });
  console.log('questions', questions.value);

  // questions.value = questions.value.slice();
}
function submit() {
  // 上传最后一个问题的答案
  let lastOneIndex = questions.value.length - 1;
  if (questions.value[lastOneIndex].quesSort === 2) {
    questions.value[currentQuestionIndex.value].answer =
      questions.value[lastOneIndex].answer.join(',');
  }
  if (!isEmpty(questions.value[lastOneIndex].answer)) {
    // 上传答案
    uploadAnswer({
      gradeId: gradeId.value,
      paperId: questions.value[lastOneIndex].paperId,
      answer: questions.value[lastOneIndex].answer,
    });
  }
  // 提交答案
  endExam(quizState.objId);
  router.push({ name: 'ExamList' });
}
</script>

<template>
  <div class="flex items-start gap-8 max-w-1600px mx-auto">
    <el-card class="w-900px mx-auto">
      <div class="exam">
        <div
          v-for="(question, index) in questions"
          v-show="currentQuestionIndex === index"
          :key="question.paperId"
        >
          <h2>{{ `第${index + 1}题：` }}</h2>
          <div v-html="question.quesContent"></div>
          <div v-if="question.quesSort !== 3">
            <template v-if="question.quesSort === 1">
              <el-radio-group v-model="question.answer" class="ml-4">
                <el-radio
                  v-for="option in question.items"
                  :key="option.prefix"
                  :label="option.prefix"
                  size="large"
                  ><div class="flex">
                    {{ option.prefix + '：' }}
                    <p v-html="option.content"></p></div
                ></el-radio>
              </el-radio-group>
            </template>
            <template v-else>
              <el-checkbox-group v-model="question.answer" class="ml-4">
                <div v-for="option in question.items" :key="option.prefix">
                  <el-checkbox :label="option.prefix" size="large"
                    ><div class="flex">
                      {{ option.prefix + '：' }}
                      <p v-html="option.content"></p></div
                  ></el-checkbox>
                </div>
              </el-checkbox-group>
            </template>
          </div>
          <div v-else>
            <el-radio-group v-model="question.answer" class="ml-4">
              <el-radio :label="question.items[0].prefix" size="large">{{
                question.items[0].prefix
              }}</el-radio>
              <el-radio :label="question.items[1].prefix" size="large">{{
                question.items[1].prefix
              }}</el-radio>
            </el-radio-group>
          </div>

          <div class="dir-button flex justify-center gap-8 mt-16">
            <el-button @click="prevQuestion">上一题</el-button>
            <el-button
              v-if="index !== questions.length - 1"
              @click="nextQuestion(index)"
              >下一题</el-button
            >
            <el-button v-else type="primary" @click="submit">提交</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="shrink-0 hpaperIdden md:block">
      <template #header>
        <div class="flex justify-between">一：所有题目</div>
      </template>
      <div>
        <el-button
          v-for="(v, i) in questions"
          :key="v.paperId"
          :type="isEmpty(v.answer) ? '' : 'primary'"
          @click="currentQuestionIndex = i"
        >
          {{ i + 1 }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
