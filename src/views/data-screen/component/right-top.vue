<script setup lang="ts">
import itemWrap from './item-wrap.vue';
import { ref, onMounted } from 'vue';
import { ScreenData } from '@/api/modules/big_screen';
const props = defineProps<ScreenData>();
const option = ref({});
let mydata = reactive({
  xlist: [],
  ylist: [],
  ylist2: [],
  ylist3: [],
});
const chartStyle = computed(() => {
  // 如果props.gradeAnalysisVOS长度小于9,class宽度为550px,长度为12,class宽度为800px
  return {
    width: `${props.gradeAnalysisVOS.length < 9 ? 550 : 800}px`,
    height: '350px',
  };
});

// 根据hourType分组
const groupData = function () {
  const teacherMonths = [
    ...new Set(props.teacherHours.map((item) => item.month)),
  ];
  // 给teacherMonths排序
  const sortedMonth = teacherMonths.sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  const months = generateMonths(
    sortedMonth[0],
    sortedMonth[sortedMonth.length - 1],
  );
  const grouped = props.teacherHours.reduce((acc, cur) => {
    if (!acc[cur.hourType]) {
      acc[cur.hourType] = months.map((month) => ({
        month,
        hourType: cur.hourType,
        hourTotal: '0.0',
      }));
    }

    const monthData = acc[cur.hourType].find(
      (item) => item.month === cur.month,
    );
    if (monthData) {
      monthData.hourTotal = cur.hourTotal;
    }

    return acc;
  }, {});

  console.log(grouped);
  mydata.xlist = months;
  mydata.ylist = grouped['1'].map((item) => item.hourTotal);
  mydata.ylist2 = grouped['2'].map((item) => item.hourTotal);
  mydata.ylist3 = grouped['3'].map((item) => item.hourTotal);
};

// 生成所有的月份
function generateMonths(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const months = [];
  while (startDate <= endDate) {
    const month = startDate.getMonth() + 1;
    months.push(
      `${startDate.getFullYear()}-${month < 10 ? '0' + month : month}`,
    );
    startDate.setMonth(startDate.getMonth() + 1);
  }
  return months;
}

watch(
  () => props.teacherHours,
  (newVal) => {
    if (newVal) {
      groupData();
      setOption(mydata.xlist, mydata.ylist, mydata.ylist2, mydata.ylist3);
    }
  },
);

const setOption = async (
  xData: any[],
  yData: any[],
  yData2: any[],
  yData3: any[],
) => {
  option.value = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['直播课时', '视频课时', '实验课时'],
      orient: 'vertical',
      top: '0',
      right: '0',
      textStyle: {
        color: '#fff',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      type: 'value',
    },
    series: [
      {
        name: '直播课时',
        type: 'line',
        symbol: 'none',
        data: yData,
      },
      {
        name: '视频课时',
        type: 'line',
        symbol: 'none',
        data: yData2,
        lineStyle: {
          width: 2,
          type: 'dashed',
        },
      },
      {
        name: '实验课时',
        type: 'line',
        symbol: 'none',
        data: yData3,
      },
    ],
  };
};
</script>

<template>
  <itemWrap title="教师课时分析" :style="chartStyle">
    <v-chart
      v-if="JSON.stringify(option) != '{}'"
      class="chart"
      :option="option"
    />
  </itemWrap>
</template>

<style scoped lang="scss">
.data-item {
  height: 310px;
}
</style>
