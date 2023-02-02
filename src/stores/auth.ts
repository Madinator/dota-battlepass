import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { useUserStore } from '@/stores/user';
import { useRouletteStore } from '@/stores/roulette';
import { useEventsStore } from '@/stores/events';
import { authApiService, type UserData } from '@/services/api/auth/index';


interface State {
  jobId: string,
  user: UserData,
  isRegistered: boolean,
  token: string | null,
}

export const useAuthStore = defineStore({
  id: 'authStore',

  state: (): State => ({
    jobId: '',
    user: {
      id: '',
      points: 0,
      balance: 0,
      lastSeen: new Date(),
      userId: '',
      spaceId: '',
      levelId: '',
      createdAt: '',
      updatedAt: '',
      level: 0
    } as UserData,
    isRegistered: false,
    token: null,
    // token: 'e586519d-5932-4ce3-9fd4-246e6fde5a3e',
  }),

  actions: {
    async login(zone: string, token: string) {
      await authApiService.authorization(zone, token)
      .then((response: any) => {
        // console.log('USER RESPONSE', response.success);
        this.$state.user = response.data;
        this.$state.token = response.jwsToken;
        this.$state.isRegistered = response.success;
        // location.reload();
        
        useUserStore().getUser();
        useUserStore().getUserInfo();
        useRouletteStore().getRoullettes();
        useEventsStore().getPrizesForLevels();
      })
      .catch((error) => {
        if(error?.response?.status === 400) {
          alert('Не верный логин или пароль');
        }
        
        this.$state.isRegistered = false;
      })
    },
  }
})