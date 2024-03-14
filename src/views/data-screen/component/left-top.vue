<script setup lang="ts">
import itemWrap from './item-wrap.vue';
import { ref, onMounted } from 'vue';
import { graphic } from 'echarts/core';
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
  const studentMonths = [
    ...new Set(props.studentHours.map((item) => item.month)),
  ];
  // 给studentMonths排序
  const sortedMonth = studentMonths.sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  const months = generateMonths(
    sortedMonth[0],
    sortedMonth[sortedMonth.length - 1],
  );
  const grouped = props.studentHours.reduce((acc, cur) => {
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
  () => props.studentHours,
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
      data: ['直播课时', '视频课时', '实验课时'],
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
        name: '直播课时',
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
                formatter: '直播课时：{c}',
              },
            },
            // {
            //   name: '最大值',
            //   type: 'max',
            //   valueDim: 'y',
            //   symbol: 'circle',
            //   symbolSize: 6,
            //   itemStyle: {
            //     color: '#FC9010',
            //     shadowColor: '#FC9010',
            //     shadowBlur: 8,
            //   },
            //   label: {
            //     formatter: '',
            //   },
            // },
          ],
        },
      },
      {
        data: yData2,
        type: 'line',
        smooth: true,
        symbol: 'none', //去除点
        name: '视频课时',
        color: 'rgba(9,202,243,.7)',
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
                color: 'rgba(9,202,243,.7)',
              },
              {
                offset: 1,
                color: 'rgba(9,202,243,.0)',
              },
            ],
            false,
          ),
        },
        markPoint: {
          data: [
            {
              name: '最大值',
              type: 'max',
              valueDim: 'y',
              symbol: 'rect',
              symbolSize: [60, 26],
              symbolOffset: [0, -20],
              itemStyle: {
                color: 'rgba(0,0,0,0)',
              },
              label: {
                color: '#09CAF3',
                backgroundColor: 'rgba(9,202,243,0.1)',

                borderRadius: 6,
                borderColor: 'rgba(9,202,243,.5)',
                padding: [7, 14],
                formatter: '视频课时：{c}',
                borderWidth: 0.5,
              },
            },
            {
              name: '最大值',
              type: 'max',
              valueDim: 'y',
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#09CAF3',
                shadowColor: '#09CAF3',
                shadowBlur: 8,
              },
              label: {
                formatter: '',
              },
            },
          ],
        },
      },
      {
        data: yData3,
        type: 'line',
        smooth: true,
        symbol: 'none', //去除点
        name: '实验课时',
        color: 'rgba(88, 103, 195,.7)',
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
                color: 'rgba(88, 103, 195,.7)',
              },
              {
                offset: 1,
                color: 'rgba(88, 103, 195,.0)',
              },
            ],
            false,
          ),
        },
        markPoint: {
          data: [
            {
              name: '最大值',
              type: 'max',
              valueDim: 'y',
              symbol: 'rect',
              symbolSize: [60, 26],
              symbolOffset: [0, -20],
              itemStyle: {
                color: 'rgba(0,0,0,0)',
              },
              label: {
                color: '#5867c3',
                backgroundColor: 'rgba(88, 103, 195,0.1)',

                borderRadius: 6,
                borderColor: 'rgba(88, 103, 195,.5)',
                padding: [7, 14],
                formatter: '实验课时：{c}',
                borderWidth: 0.5,
              },
            },
            {
              name: '最大值',
              type: 'max',
              valueDim: 'y',
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#5867c3',
                shadowColor: '#5867c3',
                shadowBlur: 8,
              },
              label: {
                formatter: '',
              },
            },
          ],
        },
      },
    ],
  };
};
// onMounted(() => {
//   setOption(mydata.xlist, mydata.ylist, mydata.ylist2, mydata.ylist3);
// });
</script>

<template>
  <itemWrap title="学员每月学习课时分析" :style="chartStyle">
    <v-chart
      v-if="JSON.stringify(option) != '{}'"
      class="chart"
      :option="option"
    />
  </itemWrap>
</template>

<style scoped lang="scss">
.data-item {
  height: 380px;
  width: 480px;
}
</style>
