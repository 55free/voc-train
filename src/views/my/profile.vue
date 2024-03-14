<script lang="ts" setup>
import type { FormInstance } from 'element-plus';
import { CascaderOption } from 'element-plus';
import { profileRules } from './rule';
import { getAreaIdList, getDeptList, IDeptInfo } from '@/api/modules/login';
import {
  getProfile,
  IProfile,
  updateUserProfile,
  updateUserPwd,
} from '@/api/modules/my';
const selected = ref(0);
const profileFormRef = ref<FormInstance>();
const pwdFormRef = ref<FormInstance>();
const areaTree = ref<CascaderOption[]>([]);
const deptList = ref<IDeptInfo[]>([]);
const cascaderProps = {
  emitPath: false,
};
const profile = reactive<IProfile>({
  createBy: '',
  createTime: '',
  updateBy: null,
  updateTime: null,
  remark: '',
  params: null,
  userId: 0,
  deptId: 0,
  userName: '',
  nickName: '',
  email: '',
  phonenumber: '',
  sex: '',
  avatar: '',
  password: '',
  status: '',
  delFlag: '',
  loginIp: '',
  loginDate: '',
  dept: {
    createBy: null, // 创建人，默认为null
    createTime: new Date(), // 创建时间，默认为当前时间
    updateBy: null, // 更新人，默认为null
    updateTime: new Date(), // 更新时间，默认为当前时间
    remark: '', // 备注，默认为空字符串
    params: {}, // 参数，默认为空对象
    deptId: 0, // 部门ID，默认为0
    parentId: 0, // 父部门ID，默认为0
    ancestors: '', // 祖先ID列表，默认为空字符串
    deptName: '新部门', // 部门名称，默认为"新部门"
    orderNum: 0, // 排序，默认为0
    leader: '', // 领导，默认为空字符串
    leaderUserId: null, // 领导用户ID，默认为null
    phone: '', // 电话，默认为空字符串
    email: '', // 电子邮件，默认为空字符串
    status: '正常', // 状态，默认为"正常"
    delFlag: '0', // 删除标记，默认为"0"（通常表示未删除）
    parentName: '', // 父部门名称，默认为空字符串
    children: [], // 子部门列表，默认为空数组
  }, // 假设 Dept 是一个类，你需要根据实际情况来创建一个新的 Dept 实例
  roles: [], // 假设 Role 是一个类，你需要根据实际情况来创建一个新的 Role 数组
  roleIds: null,
  postIds: null,
  roleId: null,
  classId: null,
  areaCode: null,
  admin: false,
});
const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
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
getDeptList().then((res) => {
  deptList.value = res.data;
});
const getProfileInfo = () => {
  getProfile().then((res) => {
    const profileData = res.data;
    for (const key in profileData) {
      profile[key] = profileData[key];
    }
  });
};
getProfileInfo();
const updateProfile = async function (formEl: FormInstance | undefined) {
  if (!formEl) return;
  console.log('profile', formEl);

  await formEl.validate((valid) => {
    if (valid) {
      updateUserProfile(profile)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success('更新成功');
            getProfileInfo();
          }
        })
        .catch((err) => {
          ElMessage.error('更新失败');
        });
    }
  });
};
const pwdrule = {
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      required: true,
      validator: (rule, value, callback) => {
        if (pwdForm.newPassword !== value) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};
const updatePwd = async function () {
  await pwdFormRef.value?.validate((valid) => {
    if (valid) {
      updateUserPwd(pwdForm.oldPassword, pwdForm.newPassword)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success('更新成功');
          }
        })
        .catch((err) => {
          ElMessage.error('更新失败');
        });
    }
  });
};
</script>

<template>
  <div class="flex mx-auto w-85% gap-8 justify-center">
    <el-card class="w-[1240px]">
      <template #header>
        <div class="title">基本资料</div>
      </template>
      <el-tabs v-model="selected">
        <el-tab-pane label="个人信息" :name="0">
          <div class="user-info">
            <el-form
              ref="profileFormRef"
              label-width="100px"
              :model="profile"
              :rules="profileRules"
              size="large"
            >
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="profile.userName" />
              </el-form-item>
              <el-form-item label="昵称" prop="nickName">
                <el-input v-model="profile.nickName" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="profile.email" />
              </el-form-item>
              <el-form-item label="手机号" prop="phonenumber">
                <el-input v-model="profile.phonenumber" />
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="profile.sex">
                  <el-radio label="0">男</el-radio>
                  <el-radio label="1">女</el-radio>
                  <el-radio label="2">未知</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item prop="areaCode" label="所属地区">
                <el-cascader
                  v-model="profile.areaCode"
                  :props="cascaderProps"
                  :options="areaTree"
                  placeholder="所属地区"
                  clearable
                  class="w-full"
                />
              </el-form-item>
              <el-form-item prop="deptId" label="所属部门">
                <el-select
                  v-model="profile.deptId"
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
              <el-form-item>
                <el-button type="primary" @click="updateProfile(profileFormRef)"
                  >更新</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="密码修改" :name="1">
          <!-- 密码修改 -->
          <el-form
            ref="pwdFormRef"
            label-width="100px"
            :model="pwdForm"
            :rules="pwdrule"
            size="large"
          >
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="pwdForm.oldPassword" clearable show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="pwdForm.newPassword" clearable show-password />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="pwdForm.confirmPassword"
                clearable
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updatePwd">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
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
:deep(.el-tabs__nav-wrap::after) {
  width: 0;
}
:deep(.el-tabs__header) {
  border-bottom: none;
}
</style>
