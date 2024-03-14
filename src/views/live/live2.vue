<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

function goBack() {
  router.back();
}
</script>

<template>
  <h1 class="title">{{ 'test2' }}</h1>

  <div
    class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
  >
    <div class="md:flex">
      <div class="md:shrink-0">
        <img
          class="h-48 w-full object-cover md:h-full md:w-48 md:object-scale-down"
          src="@/assets/images/building.jpg"
          alt="Modern building architecture"
        />
      </div>
      <div class="p-8">
        <div
          class="uppercase tracking-wide text-sm text-indigo-500 font-semibold"
        >
          Company retreats
        </div>
        <a
          href="#"
          class="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
          >Incredible accommodation for your team</a
        >
        <p class="mt-2 text-slate-500">
          Looking to take your team away on a retreat to enjoy awesome food and
          take in some sunshine? We have a list of places to do just that.
        </p>
      </div>
    </div>
  </div>

  <el-button @click="goBack">Back</el-button>
</template>

<style lang="scss" scoped>
.title {
  font-size: 32px;
  font-weight: bold;
  line-height: 100px;
}

.user-info {
  margin: 20px auto;
  font-weight: bold;
  color: green;
}
</style>
