import { defineStore } from 'pinia';
import type { PrizeRequest, Prize, UserAcountsInfo } from '@/services/api/user/index';
import { PlatformNames } from '@/services/api/user/index';
import { userApiService } from '@/services/api/user/index';
import type { UserInfo, UserData } from '@/services/api/auth/models';

interface State {
  // user: {
  //   id: null | string;
  //   nickname: null | string;
  //   level: number;
  //   currentEventId: null | number | string;
  //   currentEventHp: null | number;
  //   xp: number;
  //   spins: number;
  //   wonMoney: number;
  // },
  spinsAmount: number,
  prizes: Prize[],
  accounts: UserAcountsInfo,
  user: UserData,
  userInfo: UserInfo,
}

export const useUserStore = defineStore({
  id: 'UserStore',

  state: (): State => ({
    // user: {
    //     id: '1',
    //     // id: null,
    //     nickname: null,
    //     level: 1,
    //     currentEventId: 1,
    //     currentEventHp: null,
    //     // xp: 5500,
    //     xp: 0,
    //     spins: 300,
    //     wonMoney: 0
    // },
    spinsAmount: 2,
    prizes: [],
    accounts: {
      user_twitch: {
        name: PlatformNames.TWITCH,
        username: null
      },
      user_steam: {
        name: PlatformNames.DOTA2,
        username: null
      }
    },
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
    userInfo: {
      createAt: new Date(),
      email: '',
      emailVerified: false,
      firstName: null,
      id: '',
      language: '',
      lastname: null,
      timezone: '',
      updatedAt: '',
      username: '',
    } as UserInfo,
  }),

  actions: {
    async getUserInfo() {
      await userApiService.getMe()
      .then((response: TypedResponse<UserInfo>) => {
        if(response.status === 200) {
          this.$state.user = response.data;
        }
      })
    },
    async getUser() {
      await userApiService.me()
      .then((response: TypedResponse<UserData>) => {
        if(response.status === 200) {
          this.$state.userInfo = response.data;
        }
      })
      .catch((error) => {
      })
    },
    async getPrizes() {
      await userApiService.getPrizesList()
      .then((response: TypedResponse<PrizeRequest[]>) => {
        if(response.status === 200) {
          this.setPrizes(response.data);
        }
      })
      .catch((error) => {
        
      })
    },
    setPrizes(data: PrizeRequest[]): void {
      this.$state.prizes = [];
      for(let i=0; i<data.length;i++) {
        let samePrize=1;
        for(let j=i+1; j<data.length-1;j++ ) {
          if(data[i].prizeId === data[j].prizeId) 
          {
            samePrize++;
          }
        }
        if(this.$state.prizes.findIndex(item => item.prizeId === data[i].prizeId)) {
          this.$state.prizes.push({ amount: samePrize, ...data[i]})
        }
      }
    },
    async getUserAccountsInfo() {
      await userApiService.getAccountsInfo()
      .then((response: TypedResponse<UserAcountsInfo>) => {
        if(response.status === 200) {
          this.$state.accounts.user_steam.username = response.data.user_steam;
          this.$state.accounts.user_twitch.username = response.data.user_twitch;
        }
      })
      .catch((error) => {

      })
    }
  }
})
