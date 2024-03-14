<script lang="ts" setup>
import { Connection, UserFilled } from '@element-plus/icons-vue';
</script>

<template>
  <div class="w-full detail text-left">
    <section class="harvest">
      <h2 class="font-900 text-lg mb-4 pt-4">你将获得</h2>
      <div>
        <p class="text-#586470 text-sm flex items-center mb-4">
          <span class="dot"></span>掌握某些知识点
        </p>
        <p class="text-#586470 text-sm flex items-center">
          <span class="dot"></span>学会某些技巧
        </p>
      </div>
    </section>
    <section class="service mt-4">
      <h2 class="font-900 text-lg mb-4 pt-4">教学服务</h2>
      <div class="border-2 rounded border-#f5f6fa border-solid p-4">
        <div class="flex items-center">
          <Connection
            style="width: 1.5rem; height: 1.5rem; margin-right: 8px"
          />
          <span>1v1专属答疑服务</span>
        </div>
      </div>
    </section>
    <section class="teacher-intro mt-4">
      <h2 class="font-900 text-lg mb-4 pt-4">讲师介绍</h2>
      <div class="rounded-10 p-4 bg-#f5f8fa w-1/3 p-6 dark:bg-black">
        <div class="flex">
          <el-avatar :icon="UserFilled" />
          <div class="ml-4 tea-name">
            <p class="text-sm">教师</p>
            <p class="text-#586470 text-sm dark:text-light">教师简介</p>
          </div>
        </div>
        <el-divider />
        <p class="text-sm">每日分享编程知识，帮助编程小白，。</p>
      </div>
    </section>
    <!-- <section class="class-detail mt-4">
      <h2 class="font-900 text-lg mb-4 pt-4">课程详情</h2>
      <div class="flex justify-center">
        <img src="@/assets/images/class-detail.jpg" alt="" />
      </div>
    </section> -->
  </div>
</template>

<style lang="scss" scoped>
.dot {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  background-color: #586470;
  margin-right: 0.5rem;
}
</style>
