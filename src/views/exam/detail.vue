<script lang="ts" setup>
import { getExamDetailInfo, IExamDetailInfo } from '@/api/modules/exam';
import { useDictStore } from '@/store/dict';

const examId = useRoute().params.id;
const router = useRouter();
const examDetailInfo = ref<IExamDetailInfo>({
  objId: 0,
  examName: '',
  examFullscore: '',
  deptName: '',
  crName: '',
  crAddress: '',
  startTime: '',
  endTime: '',
  examHour: '',
  examTypeName: '',
  examCategory: 0,
  examTeacherName: '',
  imagePath: '',
  count: 0,
  participationStatus: 0,
  remaining: null,
  remark: null,
});
getExamDetailInfo(parseInt(examId as string)).then((res) => {
  examDetailInfo.value = res.data;
});

const examState = computed(() => {
  // 0:未开始 1:已结束 2:进行中
  // 返回对象 包括 button状态和按钮文字
  if (examDetailInfo.value.participationStatus === 0) {
    return {
      buttonType: 'primary',
      buttonText: '开始考试',
    };
  } else if (examDetailInfo.value.participationStatus === 1) {
    return {
      buttonType: 'success',
      buttonText: '已参与',
    };
  } else {
    return {
      buttonType: 'warning',
      buttonText: '进行中',
    };
  }
});

const handleButtonClick = () => {
  router.push({
    name: 'ExamGoing',
    params: {
      id: examId as string,
    },
  });
};
</script>

<template>
  <div class="flex justify-center flex-col max-w-1000px mx-auto gap-8">
    <el-descriptions class="margin-top" title="考试详情" :column="3" border>
      <!-- <template #extra>
        <el-button
          v-if="examDetailInfo.participationStatus !== 0"
          type="primary"
          @click="$router.push('/exam/finished/' + examDetailInfo.objId)"
          >我的答题</el-button
        >
      </template> -->
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">考试名称</div>
        </template>
        {{ examDetailInfo.examName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">地址</div>
        </template>
        {{ examDetailInfo.crAddress }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">教室</div>
        </template>
        {{ examDetailInfo.crName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">题目类别</div>
        </template>
        {{ examDetailInfo.examTypeName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">试卷类别</div>
        </template>
        {{ useDictStore().examDict[examDetailInfo.examCategory] }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">监考教师</div>
        </template>
        {{ examDetailInfo.examTeacherName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">开始日期</div>
        </template>
        {{ examDetailInfo.startTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">结束日期</div>
        </template>
        {{ examDetailInfo.endTime }}
      </el-descriptions-item>
      <!-- <el-descriptions-item>
        <template #label>
          <div class="cell-item">已考次数</div>
        </template>
        {{ examDetailInfo.count }}
      </el-descriptions-item> -->
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">考试时间</div>
        </template>
        {{ examDetailInfo.examHour }}分钟
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">分值</div>
        </template>
        {{ examDetailInfo.examFullscore }}
      </el-descriptions-item>
    </el-descriptions>
    <el-button
      :type="(examState.buttonType as any)"
      :disabled="examDetailInfo.participationStatus === 1"
      @click="handleButtonClick"
      >{{ examState.buttonText }}</el-button
    >
  </div>
</template>

<style lang="scss" scoped></style>
