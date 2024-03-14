<script lang="ts" setup>
import { isDark, toggleDark } from '@/composables';
import { toast } from '@/utils/toast';
import API from '@/api';
import Motion from '@/utils/motion';
import type { FormInstance } from 'element-plus';
import { loginRules } from './utils/rule';
import { useUserStore } from '@/store/user';
import useMenusStore from '@/store/menus';
import { Sunny, Moon, User, Lock, Timer } from '@element-plus/icons-vue';
import { initRouter } from '@/router/utils';
import registe from './components/regist.vue';
import { useDictStore } from '@/store/dict';
import { isEmpty } from '@/utils/helper';
import { storeToRefs } from 'pinia';
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const userStore = useUserStore();
const { currentPage } = storeToRefs(userStore);
const menusStore = useMenusStore();
const imgCode = ref('');
const captchaEnabled = ref(false);
const ruleForm = reactive({
  username: 'admin',
  password: 'admin123',
  verifyCode: '',
  uuid: '',
});
const loading = ref(false);
const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      userStore
        .loginByUsername({
          username: ruleForm.username,
          password: ruleForm.password,
          verifyCode: ruleForm.verifyCode,
          uuid: ruleForm.uuid,
        })
        .then((res: any) => {
          if (res.code === 200) {
            // 获取字典
            getDict();
            // 获取后端路由
            initRouter().then(() => {
              router.push('/');
              toast({
                message: '登录成功',
                type: 'success',
              });
            });
          }
        })
        .catch((err) => {
          if (captchaEnabled.value) {
            getCode();
          }
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      loading.value = false;
      return fields;
    }
  });
};
const getDict = () => {
  isEmpty(useDictStore().examDict) && useDictStore().getExamDict();
  isEmpty(useDictStore().noticeDict) && useDictStore().getNoticeDict();
  isEmpty(useDictStore().courseChargeDict) &&
    useDictStore().getCourseChargeDict();
  isEmpty(useDictStore().courseDifficultyDict) &&
    useDictStore().getCourseDifficultyDict();
  isEmpty(useDictStore().courseLabelDict) &&
    useDictStore().getCourseLabelDict();
};
function toggleTheme() {
  toggleDark();
}

const getCode = function () {
  API.getCaptchaImage().then((res) => {
    captchaEnabled.value =
      res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      imgCode.value = 'data:image/gif;base64,' + res.img;
      ruleForm.uuid = res.uuid;
    }
  });
};
getCode();
</script>

<template>
  <div class="select-none">
    <img src="@/assets/login/bg.png" alt="logo" class="wave" />
    <div class="flex-col absolute right-5 top-3">
      <el-button
        :type="!isDark ? 'info' : 'default'"
        :icon="!isDark ? Moon : Sunny"
        :circle="true"
        @click.prevent="toggleTheme"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <img src="@/assets/login/illustration.svg" alt="logo" />
      </div>

      <div class="login-box">
        <div class="login-form">
          <h2>云端协同大数据<br />教学综合管理平台</h2>
          <el-form
            v-if="currentPage === 0"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
            @keydown.enter="onLogin(ruleFormRef)"
          >
            <Motion
              ><el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur',
                  },
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  placeholder="账号"
                  :prefix-icon="User"
                /> </el-form-item
            ></Motion>
            <Motion :delay="100"
              ><el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="Lock"
                /> </el-form-item
            ></Motion>
            <Motion :delay="150"
              ><el-form-item prop="verifyCode">
                <el-input
                  v-model="ruleForm.verifyCode"
                  clearable
                  placeholder="验证码"
                  :prefix-icon="Timer"
                >
                  <template #append>
                    <img
                      class="cursor-pointer h-38px"
                      :src="imgCode"
                      alt="验证码"
                      @click="getCode"
                    />
                  </template>
                </el-input> </el-form-item
            ></Motion>

            <Motion :delay="200">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
            <Motion :delay="250">
              <div class="mt-4">
                <el-button
                  class="w-full"
                  size="default"
                  @click="currentPage = 1"
                >
                  注册
                </el-button>
              </div>
            </Motion>
          </el-form>
          <!-- elbutton green 注册 -->

          <registe v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-input-group__append) {
  padding: 0;
}
.wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}

.login-container {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 18rem;
  padding: 0 2rem;
}

.img {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.img img {
  width: 500px;
}

.login-box {
  display: flex;
  align-items: center;
  text-align: center;
}

.login-form {
  width: 360px;
}

.avatar {
  width: 350px;
  height: 80px;
}

.login-form h2 {
  text-transform: uppercase;
  margin: 15px 0;
  color: #999;
  font: bold 200% Consolas, Monaco, monospace;
}

@media screen and (max-width: 1180px) {
  .login-container {
    grid-gap: 9rem;
  }

  .login-form {
    width: 290px;
  }

  .login-form h2 {
    font-size: 2.4rem;
    margin: 8px 0;
  }

  .img img {
    width: 360px;
  }

  .avatar {
    width: 280px;
    height: 80px;
  }
}

@media screen and (max-width: 968px) {
  .wave {
    display: none;
  }

  .img {
    display: none;
  }

  .login-container {
    grid-template-columns: 1fr;
  }

  .login-box {
    justify-content: center;
  }
}
</style>
