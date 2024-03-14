import { useUserStore } from '@/store/user';
export type userType = {
  username?: string;
  roles?: Array<string>;
  currentPage?: number; //0:登录页,1:注册页
};
const TOKEN_KEY = 'v_token';
export const userInfo = useStorage<userType>('userInfo', {});
export const userToken = useStorage<string>(TOKEN_KEY, '');
/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(token: string) {
  userToken.value = token;
}

export function getToken() {
  return userToken.value;
}

export function removeToken() {
  userInfo.value = {};
  userToken.value = null;
}

export const formatToken = (token: string): string => {
  return 'Bearer ' + token;
};
