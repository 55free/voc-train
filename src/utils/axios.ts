import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  CustomParamsSerializer,
} from 'axios';
import { stringify } from 'qs';
import { ElMessageBox, ElMessage } from '@/utils/toast';
import { useUserStore } from '@/store/user';
import NProgress from './ReNprogress';
import { getToken, formatToken } from './token';

const baseURL = import.meta.env.VITE_BASE_URL as string;
const defaultConfig: AxiosRequestConfig = {
  baseURL,
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json;charset=utf-8',
    'X-Requested-With': 'XMLHttpRequest',
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
};
const service = axios.create(defaultConfig);
let isMessageBoxShowing = false;
const errorCode = {
  '401': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  default: '系统未知错误，请反馈给管理员',
};

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1

// Request interceptors
service.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<any> => {
    // 开启进度条动画
    NProgress.start();
    /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
    const whiteList = ['/login', '/captchaImage'];
    return whiteList.find((url) => url === config.url)
      ? config
      : new Promise((resolve) => {
          const data = getToken();
          if (data) {
            config.headers['Authorization'] = formatToken(data);
            resolve(config);
          } else {
            resolve(config);
          }
        });
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptors
service.interceptors.response.use(
  async (res: AxiosResponse) => {
    NProgress.done();
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default'];
    // 二进制数据则直接返回
    if (
      res.request.responseType === 'blob' ||
      res.request.responseType === 'arraybuffer'
    ) {
      return res.data;
    }
    if (code === 401) {
      if (!isMessageBoxShowing) {
        isMessageBoxShowing = true;
        ElMessageBox.confirm(
          '登录状态已过期，您可以继续留在该页面，或者重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          },
        )
          .then(() => {
            useUserStore().logOut();
          })
          .finally(() => {
            isMessageBoxShowing = false;
          });
        return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
      }
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' });
      return Promise.reject(new Error(msg));
    } else if (code === 601) {
      ElMessage({ message: msg, type: 'warning' });
      return Promise.reject('error');
    } else if (code !== 200) {
      ElNotification({
        title: msg,
        type: 'error',
        duration: 2000,
      });
      return Promise.reject('error');
    } else {
      return res.data;
    }
  },
  (error: any) => {
    console.log('err' + error);
    let { message } = error;
    if (message == 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常';
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 });
    return Promise.reject(error);
  },
);

export default service;
