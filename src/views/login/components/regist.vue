<script setup lang="ts">
import { ref, reactive } from 'vue';
import API from '@/api';
import Motion from '@/utils/motion';
import { message } from '@/utils/message';
import type { FormInstance } from 'element-plus';
import { useUserStore } from '@/store/user';
import {
  Lock,
  UserFilled as User,
  Timer,
  Iphone,
} from '@element-plus/icons-vue';
import { registerRules } from '../utils/rule';
import { CascaderOption } from 'element-plus';
import {
  getDeptList,
  IDeptInfo,
  getAreaIdList,
  IAreaCodeInfo,
  register,
} from '@/api/modules/login';

const checked = ref(false);
const loading = ref(false);
const router = useRouter();
const ruleForm = reactive({
  username: '',
  nickName: '',
  phonenumber: '',
  code: '',
  password: '',
  repeatPassword: '',
  deptId: '',
  areaCode: '',
  uuid: '',
  sex: '0',
});
const ruleFormRef = ref<FormInstance>();
const imgCode = ref('');
const captchaEnabled = ref(false);
const deptList = ref<IDeptInfo[]>([]);
const areaTree = ref<CascaderOption[]>([]);
const cascaderProps = {
  emitPath: false,
};
const repeatPasswordRule = [
  {
    validator: (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'));
      } else if (ruleForm.password !== value) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    },
    trigger: 'blur',
  },
];

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
getDeptList().then((res) => {
  deptList.value = res.data;
});
getAreaIdList().then((res) => {
  areaTree.value = res.data.map((item) => {
    return {
      value: item.id,
      label: item.label,
      children: item.children
        ? item.children.map((child) => {
            return {
              value: child.id,
              label: child.label,
            };
          })
        : [],
    };
  });
});

const onUpdate = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { repeatPassword, ...rest } = ruleForm;
      const registerForm = rest;
      register(registerForm)
        .then((res) => {
          if (res.code === 200) {
            message('注册成功', { type: 'success' });
            useUserStore().SET_CURRENT_PAGE(0);
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

      // message(transformI18n($t('login.tickPrivacy')), { type: 'warning' }); 隐私政策
    } else {
      loading.value = false;
      return fields;
    }
  });
};
function onBack() {
  useUserStore().SET_CURRENT_PAGE(0);
}
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="registerRules"
    size="large"
  >
    <el-form-item
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
      />
    </el-form-item>

    <el-form-item
      :rules="[
        {
          required: true,
          message: '请输入昵称',
          trigger: 'blur',
        },
      ]"
      prop="nickName"
    >
      <el-input
        v-model="ruleForm.nickName"
        clearable
        placeholder="用户昵称:例用户0900"
        :prefix-icon="User"
      />
    </el-form-item>

    <!-- 性别 -->
    <el-form-item prop="sex" label="性别：">
      <el-radio-group v-model="ruleForm.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
        <el-radio label="2">未知</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="password">
      <el-input
        v-model="ruleForm.password"
        clearable
        show-password
        placeholder="密码"
        :prefix-icon="Lock"
      />
    </el-form-item>

    <el-form-item :rules="repeatPasswordRule" prop="repeatPassword">
      <el-input
        v-model="ruleForm.repeatPassword"
        clearable
        show-password
        placeholder="确认密码"
        :prefix-icon="Lock"
      />
    </el-form-item>

    <el-form-item prop="phonenumber">
      <el-input
        v-model="ruleForm.phonenumber"
        clearable
        placeholder="手机号码"
        :prefix-icon="Iphone"
      />
    </el-form-item>

    <el-form-item prop="deptId">
      <el-select
        v-model="ruleForm.deptId"
        clearable
        placeholder="所属部门"
        class="w-full"
      >
        <el-option
          v-for="item in deptList"
          :key="item.deptId"
          :label="item.deptName"
          :value="item.deptId"
        />
      </el-select>
    </el-form-item>

    <el-form-item prop="areaCode">
      <el-cascader
        v-model="ruleForm.areaCode"
        :props="cascaderProps"
        :options="areaTree"
        clearable
        placeholder="所属地区"
        class="w-full"
      />
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        v-model="ruleForm.code"
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
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        class="w-full"
        size="default"
        type="primary"
        :loading="loading"
        @click="onUpdate(ruleFormRef)"
      >
        确定
      </el-button>
    </el-form-item>

    <el-form-item>
      <el-button class="w-full" size="default" @click="onBack">
        返回
      </el-button>
    </el-form-item>
  </el-form>
</template>
