import { defineStore } from 'pinia';
import { setToken, removeToken } from '@/utils/token';
import { router, resetRouter } from '@/router';
import { login, getInfo } from '@/api/modules/login';
import { toast, confirm } from '@/utils/toast';
import { userInfo, userType } from '@/utils/token';

export const useUserStore = defineStore({
  id: 'user',
  state(): userType {
    return {
      username: userInfo.value?.username ?? '',
      roles: userInfo.value?.roles ?? [],
      currentPage: 0, //0:登录页,1:注册页

    };
  },
  getters: {
    isLogin: (state: userType) => !!state.username,
  },
  actions: {
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    SET_CURRENT_PAGE(currentPage: number) {
      this.currentPage = currentPage;
    },
    SET_SELECTED_TAG(selectedTag: number) {
      this.selectedTag = selectedTag;
    },
    async loginByUsername(data: any) {
      return new Promise((resolve, reject) => {
        login(data.username.trim(), data.password, data.verifyCode, data.uuid)
          .then((data) => {
            if (data) {
              setToken(data.token);
              this.getInfo();
              resolve(data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((data) => {
            if (data) {
              this.SET_USERNAME(data.user.userName);
              this.SET_ROLES(data.roles);
              userInfo.value = {
                username: data.user.userName,
                roles: data.roles,
              };
              resolve(data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    logOut() {
      this.username = '';
      this.roles = [];
      removeToken();
      resetRouter();
      router.push({ name: 'Login' });
    },
  },
});
