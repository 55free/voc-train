import { reactive } from 'vue';
import type { FormRules } from 'element-plus';

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

export const REGEXP_PHONE = /^1[3-9]\d{9}$/;
/** 登录校验 */
const loginRules = reactive(<FormRules>{
  username: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  verifyCode: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});

const registerRules = reactive(<FormRules>{
  username: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!REGEXP_PWD.test(value)) {
          callback(
            new Error('密码格式应为8-18位数字、字母、符号的任意两种组合'),
          );
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  nickName: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入昵称'));
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error('手机号格式不正确'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  phonenumber: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if (!REGEXP_PHONE.test(value)) {
          callback(new Error('手机号格式不正确'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  deptId: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择部门'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  areaCode: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          console.log('请选择地区');
          callback(new Error('请选择地区'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  code: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});

export { loginRules, registerRules };
