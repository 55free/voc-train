<script setup lang="ts">
import itemWrap from './item-wrap.vue';
import SeamlessScroll from '@/components/ReSeamlessScroll';
import { ScreenData } from '@/api/modules/big_screen';
const props = defineProps<ScreenData>();
const listData = ref([
  {
    name: '教师1',
    title: '上传课件 课件ID：123456',
    atTime: '2021-08-12 12:12:12',
    status: '成功',
  },
  {
    name: '教师2',
    title: '修改课件 课件ID：123456',
    atTime: '2021-08-12 12:12:12',
    status: '成功',
  },
  {
    name: '教师3',
    title: '上传课件 课件ID：123456',
    atTime: '2021-08-12 12:12:12',
    status: '成功',
  },
  {
    name: '教师4',
    title: '修改课件 课件ID：123456',
    atTime: '2021-08-12 12:12:12',
    status: '失败',
  },
  {
    name: '同学1',
    title: '观看课程 课件ID：123456',
    atTime: '2021-08-12 12:12:12',
    status: '成功',
  },
  {
    name: '同学2',
    title: '观看课程 课件ID：123456',
    atTime: '2021-08-12 12:12:12',
    status: '成功',
  },
  {
    name: '同学3',
    title: '观看直播 课件ID：123456',
    atTime: '2021-08-12 12:12:12',
    status: '成功',
  },
  {
    name: '同学4',
    title: '完成考试 课件ID：123456',
    atTime: '2021-08-12 12:12:12',
    status: '失败',
  },
]);
</script>

<template>
  <itemWrap title="事件提醒" class="data-item">
    <SeamlessScroll
      ref="scroll"
      :data="listData"
      class="wrap"
      :class-option="{ direction: 'top', singleHeight: 200, waitTime: 3000 }"
    >
      <ul class="item relative">
        <li v-for="(v, index) in listData" :key="index">
          <div class="flex justify-between">
            <span class="orderNum text-bluegray text-lg">{{ index + 1 }}</span>
            <div class="inner_right">
              <div class="flex">
                <div class="info">
                  <span class="labels text-#fff9">姓名：</span>
                  <span class="labels text-blue">{{ v.name }}</span>
                </div>
                <div class="info">
                  <span class="labels text-#fff9">时间：</span>
                  <span class="labels">{{ v.atTime }}</span>
                </div>
              </div>
              <span
                :class="{
                  'text-green': v.status === '成功',
                  'text-red': v.status !== '成功',
                }"
                >{{ v.status }}</span
              >
              <div class="info titleWrap">
                <span class="text-#fff9">事件： </span>
                <span>{{ v.title }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </SeamlessScroll>
  </itemWrap>
</template>

<style scoped lang="scss">
.data-item {
  height: 380px;
  width: 480px;
}
.wrap {
  width: 100%;
  height: 290px;
  margin: 0 auto;
  overflow: hidden;

  ul {
    padding: 0;
    margin: 0 auto;
    list-style: none;

    li,
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      font-size: 14px;
      margin: 10px 0;

      .orderNum {
        margin: 0 16px 0 -20px;
      }
      .inner_right {
        position: relative;
        height: 100%;
        width: 380px;
        flex-shrink: 0;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        .info {
          margin-right: 10px;
          display: flex;
          align-items: center;
          color: #fff;
        }
        .titleWrap {
          width: 100%;
          display: flex;
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
