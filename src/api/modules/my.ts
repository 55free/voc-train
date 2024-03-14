import request from '@/utils/axios';
import { I } from '@vueuse/motion/dist/nuxt-b4cb9b59';
/**
 * 通用响应类型接口
 * @template P 泛型参数，用于表示响应结果的数据类型，默认为任意对象
 */
interface IPageResponseType<P = Record<string, any>> {
  code?: number; // 可选的状态码
  msg: string; // 响应的消息
  rows: P; // 响应结果的数据
  total: number; // 数据总数
}

interface IResponseType<P = Record<string, any>> {
  code?: number; // 可选的状态码
  msg: string; // 响应的消息
  data: P; // 响应结果的数据
}

interface IReturnType {
  code?: number; // 可选的状态码
  msg: string; // 响应的消息
}

export interface IProfile {
  createBy: string;
  createTime: string;
  updateBy?: any;
  updateTime?: any;
  remark: string;
  params: any;
  userId: number;
  deptId: number;
  userName: string;
  nickName: string;
  email: string;
  phonenumber: string;
  sex: string;
  avatar: string;
  password: string;
  status: string;
  delFlag: string;
  loginIp: string;
  loginDate: string;
  dept: Dept;
  roles: Role[];
  roleIds?: any;
  postIds?: any;
  roleId?: any;
  classId?: any;
  areaCode?: any;
  admin: boolean;
}
export interface Dept {
  createBy?: any;
  createTime?: any;
  updateBy?: any;
  updateTime?: any;
  remark?: any;
  params: any;
  deptId: number;
  parentId: number;
  ancestors: string;
  deptName: string;
  orderNum: number;
  leader: string;
  leaderUserId?: any;
  phone?: any;
  email?: any;
  status: string;
  delFlag?: any;
  parentName?: any;
  children: any[];
}

export interface Role {
  createBy?: any;
  createTime?: any;
  updateBy?: any;
  updateTime?: any;
  remark?: any;
  params: any;
  roleId: number;
  roleName: string;
  roleKey: string;
  roleSort: number;
  dataScope: string;
  menuCheckStrictly: boolean;
  deptCheckStrictly: boolean;
  status: string;
  delFlag?: any;
  flag: boolean;
  menuIds?: any;
  deptIds?: any;
  permissions?: any;
  admin: boolean;
}

const getProfile = () => {
  return request<IResponseType<IProfile>>({
    url: '/system/user/profile',
    method: 'get',
  });
};

const updateUserProfile = (data: IProfile) => {
  return request<IReturnType>({
    url: '/system/user/profile',
    method: 'put',
    data,
  });
};

// 用户密码重置
function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword,
  };
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data,
  });
}

export { getProfile, updateUserProfile, updateUserPwd };
