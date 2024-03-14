import request from '@/utils/axios';
import { RouteRecordRaw } from 'vue-router';
interface IResponseType<P = Record<string, any>> {
  code?: number;
  msg: string;
  data: P;
}
interface ILogin {
  code: number;
  msg: string;
  token: string;
}

interface ICaptchaImage {
  img: string;
  msg: string;
  code: number;
  captchaEnabled: boolean;
  uuid: string;
}

interface IUser {
  username: string;
}

interface IInfo {
  msg: string;
  code: number;
  permissions: string[];
  roles: string[];
  user: any;
}

export interface IDeptInfo {
  deptId: number;
  deptName: string;
}

export interface IAreaCodeInfo {
  id: string;
  label: string;
  code: string;
  remark: string;
  pid: string;
  orderNum: number;
  levelCode?: any;
  levelDepth?: any;
  isLeaf: string;
  createBy?: any;
  createTime?: any;
  updateBy?: any;
  updateTime?: any;
  delFlag?: any;
  children?: any;
  treeDict: string;
  path?: any;
  icon?: any;
}

/**
 * login
 *
 * @param {string} username
 * @param {string} password
 * @return {*}
 */
const login = (
  username: string,
  password: string,
  code: number,
  uuid: string,
) => {
  return request<ILogin>({
    url: '/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      uuid,
    },
  });
};

const getUser = () => {
  return request<IResponseType<IUser>>({
    url: '/user',
    method: 'get',
  });
};

const getAsyncRoutes = () => {
  return request<IResponseType<RouteRecordRaw[]>>({
    url: '/getAsyncRoutes',
    method: 'get',
  });
};

const getCaptchaImage = () => {
  return request<ICaptchaImage>({
    url: '/captchaImage',
    method: 'get',
  });
};

const getInfo = () => {
  return request<IInfo>({
    url: '/getInfo',
    method: 'get',
  });
};

const getDeptList = () => {
  return request<IResponseType<IDeptInfo[]>>({
    url: '/app/common/listDept',
    method: 'get',
  });
};

const getAreaIdList = () => {
  return request<IResponseType<IAreaCodeInfo[]>>({
    url: '/app/common/listTreeDict',
    method: 'get',
    params: {
      treeDict: 'adcode',
    },
  });
};

const register = (data: any) => {
  return request({
    url: '/register',
    method: 'post',
    data,
  });
};

export {
  login,
  getUser,
  getAsyncRoutes,
  getCaptchaImage,
  getInfo,
  getDeptList,
  getAreaIdList,
  register,
};
