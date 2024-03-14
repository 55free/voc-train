<script setup lang="ts">
import itemWrap from './item-wrap.vue';
import { ref, onMounted } from 'vue';
import { graphic } from 'echarts/core';
import { ScreenData } from '@/api/modules/big_screen';
const props = defineProps<ScreenData>();
const option = ref({});
let mydata = {
  success: true,
  data: {
    dateList: [],
    numList: [],
  },
};

watch(
  () => props.gradeAnalysisVOS,
  (newVal) => {
    if (newVal) {
      mydata.data.dateList = newVal.map((item) => item.month);
      mydata.data.numList = newVal.map((item) => item.passRate);
      setOption(mydata.data.dateList, mydata.data.numList);
    }
  },
);

const chartStyle = computed(() => {
  // 如果props.gradeAnalysisVOS长度小于9,class宽度为550px,长度为12,class宽度为800px
  return {
    width: `${props.gradeAnalysisVOS.length < 9 ? 550 : 800}px`,
    height: '350px',
  };
});

const setOption = async (xData: any[], yData: any[]) => {
  option.value = {
    xAxis: {
      // 可以显示任何字符串类型的数据。
      type: 'category',
      data: xData,
      boundaryGap: false, // 不留白，从原点开始
      // 横坐标轴在 grid 区域中的分隔线。
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(31,99,163,.2)',
        },
      },
      axisLine: {
        // show: false,
        lineStyle: {
          color: 'rgba(31,99,163,.1)',
        },
      },
      // 坐标轴刻度标签
      axisLabel: {
        color: '#7EB7FD',
        fontWeight: '500',
      },
    },
    yAxis: {
      // 只能显示数值类型的数据。
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(31,99,163,.2)',
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(31,99,163,.1)',
        },
      },
      axisLabel: {
        color: '#7EB7FD',
        fontWeight: '500',
      },
    },
    legend: {
      data: ['通过率'],
      textStyle: {
        color: '#B4B4B4',
      },
      top: '0',
      left: '0',
    },
    // 鼠标悬停在图表上时显示的提示框的样式
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,.6)',
      borderColor: 'rgba(147, 235, 248, .8)',
      textStyle: {
        color: '#FFF',
      },
    },
    // 定义了图表的布局，包括边距和边框颜色等。
    grid: {
      //布局
      show: true,
      left: '10px',
      right: '30px',
      bottom: '10px',
      top: '64px',
      containLabel: true,
      borderColor: '#1F63A3',
    },
    series: [
      {
        data: yData,
        type: 'line',
        smooth: true,
        symbol: 'none', //去除点
        name: '通过率',
        color: 'rgba(252,144,16,.7)',
        areaStyle: {
          //右，下，左，上
          color: new graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: 'rgba(252,144,16,.7)',
              },
              {
                offset: 1,
                color: 'rgba(252,144,16,.0)',
              },
            ],
            false,
          ),
        },
        markPoint: {
          data: [
            {
              name: '最大值',
              // 特殊的标注类型，用于标注最大值最小值等
              type: 'max',
              valueDim: 'y',
              symbol: 'rect',
              symbolSize: [60, 26],
              //标记相对于原本位置的偏移
              symbolOffset: [0, -20],
              itemStyle: {
                color: 'rgba(0,0,0,0)',
              },
              label: {
                color: '#FC9010',
                backgroundColor: 'rgba(252,144,16,0.1)',
                borderRadius: 6,
                padding: [7, 14],
                borderWidth: 0.5,
                borderColor: 'rgba(252,144,16,.5)',
                formatter: '通过率：{c}',
              },
            },
          ],
        },
      },
    ],
  };
};

// onMounted(() => {});
</script>

<template>
  <itemWrap title="学员考试成绩分析" :style="chartStyle">
    <v-chart
      v-if="JSON.stringify(option) != '{}'"
      class="chart"
      :option="option"
    />
  </itemWrap>
</template>

<style scoped lang="scss">
.data-item {
  height: 350px;
}
</style>
