<script lang="ts" setup>
import Header from '@/components/shared/Header.vue';
import Footer from '@/components/shared/Footer.vue';
</script>

<template>
  <el-container>
    <el-header>
      <Header />
    </el-header>
    <el-main class="main !p-0 mt-6 relative min-h-[calc(100vh-64px)]">
      <!-- <RouterView /> -->
      <router-view>
        <template #default="{ Component, route }">
          <component :is="Component" :key="route.fullPath" />
        </template>
      </router-view>
      <br />
      <br />
    </el-main>
    <el-footer class="!p-0">
      <Footer />
    </el-footer>
  </el-container>
</template>

<style lang="scss"></style>
