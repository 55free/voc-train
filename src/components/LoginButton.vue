<script lang="ts" setup>
import { ref } from 'vue';

import { toast } from '@/utils/toast';
import API from '@/api';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const router = useRouter();
const isLoginDialogVisible = ref(false);
const isLogoutDialogVisible = ref(false);
const formData = ref({
  username: 'admin',
  password: 'admin',
});

// function showLoginDialog() {
//   isLoginDialogVisible.value = true;
// }

function toLogin() {
  router.push({ name: 'Login' });
}

function logout() {
  isLogoutDialogVisible.value = true;
}

function logoutConfirm() {
  userStore.logOut();
  isLogoutDialogVisible.value = false;
}
</script>

<template>
  <div class="user-info">
    <el-dropdown v-if="userStore.username">
      <span>{{ userStore.username }}</span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="$router.push({ name: 'MyList' })">
            我的考试</el-dropdown-item
          >
          <el-dropdown-item @click="$router.push({ name: 'Profile' })">
            个人中心</el-dropdown-item
          >
          <el-dropdown-item @click="logout">注销</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- <el-button v-else id="login-btn" @click="showLoginDialog"> -->
    <el-button v-else id="login-btn" @click="toLogin"> 登录 </el-button>
  </div>

  <!-- login dialog -->
  <el-dialog id="login-dialog" v-model="isLoginDialogVisible" title="Login">
    <el-form :model="formData">
      <el-form-item label="Username">
        <el-input v-model="formData.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input
          v-model="formData.password"
          autocomplete="off"
          type="password"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isLoginDialogVisible = false"> Cancel </el-button>
        <el-button type="primary"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- logout dialog -->
  <el-dialog v-model="isLogoutDialogVisible" title="注销">
    <span>确定退出系统吗?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isLogoutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="logoutConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.user-info {
  display: flex;

  .user {
    margin-right: 20px;
    line-height: 32px;
  }
}
</style>
