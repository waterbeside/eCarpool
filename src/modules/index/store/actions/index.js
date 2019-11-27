// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。
import cookie from '@/utils/cookie';
import userApi from '@/api/user';
import config from "@/config";

export default {
  updateRefreshState ({commit}) {
    commit('updateRefreshState')
  },

  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      userApi.getInfo({ type: 2 }).then(response => {
        const { data } = response;
        if (!data) {
          reject('Verification failed, please Login again.');
        }
        data.loginname = data.loginname.toLowerCase()
        localStorage.setItem('CP_loginname',data.loginname);
        commit('setUserData',data);
        if (data.avatar.trim() !== '') {
          commit('setUserAvatar', config.avatarBasePath + data.avatar);
        }
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  },

}
