<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';
// import { currentGET, GETNOBASE } from '@/api';
import { registerMap, getMap } from 'echarts/core';
import { optionHandle, regionCodes } from './center.map';
import BorderBox13 from './border-box-13.vue';
import type { MapdataType } from './center.map';

import { toast } from '@/utils/toast';
import { ScreenData } from '@/api/modules/big_screen';
import { IAreaCodeInfo } from '@/api/modules/login';
import { flatten } from '@/utils/helper';

interface userArea {
  areaCode?: string;
  num: number;
}
const props = defineProps({
  areaData: {
    type: Array as PropType<userArea[]>,
    default: () => [],
  },
  codeList: {
    type: Array as PropType<IAreaCodeInfo[]>,
    default: () => [],
  },
});
const option = ref({});
const code = ref('guizhou'); //默认贵州
const title = '学员分布地图';

const dataSetHandle = async (regionCode: string, list: object[]) => {
  const geojson: any = await getGeojson(regionCode);
  let cityCenter: any = {};
  let mapData: MapdataType[] = [];
  //获取当前地图每块行政区中心点
  geojson.features.forEach((element: any) => {
    cityCenter[element.properties.name] =
      element.properties.centroid || element.properties.center;
  });
  //当前中心点如果有此条数据中心点则赋值x，y当然这个x,y也可以后端返回进行大点，前端省去多行代码
  list.forEach((item: any) => {
    if (cityCenter[item.name]) {
      mapData.push({
        name: item.name,
        value: cityCenter[item.name].concat(item.value),
      });
    }
  });
  await nextTick();

  option.value = optionHandle(regionCode, list, mapData);
};

const mydata = reactive({
  dataList: [],
  regionCode: 'guizhou',
});

const pairPropData = () => {
  if (props.areaData.length === 0 || props.codeList.length === 0) return;
  // 从areaData找出codeList中的对应的地区
  // areaData中的areaCode和codeList中的id对应
  // console.log(
  //   'props.areaData',
  //   props.areaData,
  //   'props.codeList',
  //   props.codeList,
  // );

  const areaData = props.areaData;
  const codeList = flatten(props.codeList);
  const result = areaData.map((item) => {
    const codeItem = codeList.find(
      (code) => code.id === (item.areaCode ?? '1762765894814695425'),
    );
    if (codeItem) {
      // 对'黔东南','黔南','黔西南'进行特殊处理
      if (codeItem.label === '黔东南') {
        codeItem.label = '黔东南苗族侗族自治州';
      } else if (codeItem.label === '黔南') {
        codeItem.label = '黔南布依族苗族自治州';
      } else if (codeItem.label === '黔西南') {
        codeItem.label = '黔西南布依族苗族自治州';
      }
      return {
        name: codeItem.label,
        value: item.num,
      };
    }
  });
  mydata.dataList = result;
  console.log('result', result);
};
watchEffect(() => {
  if (props.areaData.length > 0 && props.codeList.length > 0) {
    pairPropData();
    getData(code.value);
  }
});

const getData = async (regionCode: string) => {
  dataSetHandle(regionCode, mydata.dataList);
};

const getGeojson = (regionCode: string) => {
  return new Promise<boolean>(async (resolve) => {
    let mapjson = getMap(regionCode);
    if (mapjson) {
      mapjson = mapjson.geoJSON;
      resolve(mapjson);
    } else {
      // mapjson = await GETNOBASE(`./map-geojson/${regionCode}.json`).then(
      //   (data) => data,
      // );
      mapjson = await import(`./map-geojson/${regionCode}.json`).then(
        (data) => data,
      );
      console.log('mapjson', mapjson);

      code.value = regionCode;
      registerMap(regionCode, {
        geoJSON: mapjson as any,
        specialAreas: {},
      });
      resolve(mapjson);
    }
  });
};
getData(code.value);

const mapClick = (params: any) => {
  console.log(params);
  let xzqData = regionCodes[params.name];
  if (xzqData) {
    getData(xzqData.adcode);
  } else {
    toast({
      type: 'warning',
      message: '暂无下级地市',
    });
  }
};
</script>

<template>
  <div class="centermap">
    <div class="maptitle">
      <div class="zuo"></div>
      <span class="titletext">{{ title }}</span>
      <div class="you"></div>
    </div>
    <div class="mapwrap">
      <BorderBox13>
        <div
          v-if="code !== 'guizhou'"
          class="quanguo"
          @click="getData('guizhou')"
        >
          贵州
        </div>
        <v-chart
          v-if="JSON.stringify(option) != '{}'"
          ref="centerMapRef"
          class="chart"
          :option="option"
          @click="mapClick"
        />
      </BorderBox13>
    </div>
  </div>
</template>

<style scoped lang="scss">
.centermap {
  margin-bottom: 30px;

  .maptitle {
    height: 60px;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    box-sizing: border-box;

    .titletext {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(
        92deg,
        #0072ff 0%,
        #00eaff 48.8525390625%,
        #01aaff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 10px;
    }

    .zuo,
    .you {
      background-size: 100% 100%;
      width: 29px;
      height: 20px;
      margin-top: 8px;
    }

    .zuo {
      background: url('@/assets/images/data-screen/xiezuo.png') no-repeat;
    }

    .you {
      background: url('@/assets/images/data-screen/xieyou.png') no-repeat;
    }
  }

  .mapwrap {
    height: 900px;
    width: 100%;
    // padding: 0 0 10px 0;
    box-sizing: border-box;
    position: relative;

    .quanguo {
      position: absolute;
      right: 20px;
      top: -46px;
      width: 80px;
      height: 28px;
      border: 1px solid #00eded;
      border-radius: 10px;
      color: #00f7f6;
      text-align: center;
      line-height: 26px;
      letter-spacing: 6px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 237, 237, 0.5),
        0 0 6px rgba(0, 237, 237, 0.4);
      z-index: 10;
    }
  }
}
</style>
