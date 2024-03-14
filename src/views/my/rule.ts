export const profileRules = {
  // 属性包含userName,nickName,email,phonenumber,sex,areaCode
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phonenumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur',
    },
  ],
};
