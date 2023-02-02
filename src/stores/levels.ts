import { defineStore } from 'pinia'
import type Level from "@/interfaces/level";
import type { LevelRequest } from '@/services/api/levels';
import { levelsApiService } from '@/services/api/levels';

// interface State {
//     levels: Level[];
//     LevelsRequest: LevelRequest[],
// }
interface State {
    levelsOld: Level[];
    levels: LevelRequest[],
}

export const useLevelsStore = defineStore({
  id: 'levelsStore',

  state: (): State => ({
    // levels: [],
    // LevelsRequest: [],
    levelsOld: [],
    levels: [],
  }),

  actions: {
    // setLevels(userId: null | string | number | boolean): void {
    //     if (userId) {
    //         this.levels = [
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 1,
    //                 points: 350,
    //                 // levelAwards: null
    //             },
    //             {
    //                 description: '',
    //                 id: '2',
    //                 levelId: 2,
    //                 points: 700,
    //                 // levelAwards: null
    //                 // levelAward: 'Купон на розыгрыш №1'
    //             },
    //             {
    //                 description: '',
    //                 id: '3',
    //                 levelId: 3,
    //                 points: 1650,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 1,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №1'
    //             },
    //             {
    //                 description: '',
    //                 id: '4',
    //                 levelId: 4,
    //                 points: 2600,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 1,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №1'
    //             },
    //             {
    //                 description: '',
    //                 id: '5',
    //                 levelId: 5,
    //                 points: 3550,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 1,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №2'
    //             },
    //             {
    //                 description: '',
    //                 id: '6',
    //                 levelId: 6,
    //                 points: 4500,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 2,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №2'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 7,
    //                 points: 5450,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 2,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №2'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 8,
    //                 points: 6400,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 2,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №2'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 9,
    //                 points: 7350,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 2,
    //                 //         amount: 1
    //                 //     },
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №3'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 10,
    //                 points: 8150,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 3,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №3'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 11,
    //                 points: 8950,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 3,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №3'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 12,
    //                 points: 9750,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 3,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №3'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 13,
    //                 points: 10550,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 3,
    //                 //         amount: 1
    //                 //     },
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №3'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 14,
    //                 points: 11350,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 3,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №3'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 15,
    //                 points: 12150,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 3,
    //                 //         amount: 1
    //                 //     },
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №3'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 16,
    //                 points: 12950,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 3,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №4'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 17,
    //                 points: 13750,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 4,
    //                 //         amount: 1
    //                 //     },
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №4'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 18,
    //                 points: 14550,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 4,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №4'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 19,
    //                 points: 15350,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 4,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №4'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 20,
    //                 points: 16050,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 4,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №4'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 21,
    //                 points: 16750,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 4,
    //                 //         amount: 1
    //                 //     },
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №4'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 22,
    //                 points: 17450,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 4,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №4'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 23,
    //                 points: 18150,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 4,
    //                 //         amount: 1
    //                 //     },
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №4'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 24,
    //                 points: 18550,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 4,
    //                 //         amount: 1
    //                 //     }
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №4'
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 25,
    //                 points: 19150,
    //                 // levelAwards: [
    //                 //     {
    //                 //         type: 'coupon',
    //                 //         couponNumber: 4,
    //                 //         amount: 1
    //                 //     },
    //                 // ],
    //                 // levelAward: 'Купон на розыгрыш №5'
    //             },
    //         ]
    //     } else {
    //         this.levels = [
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 1,
    //                 points: 150,
    //                 // levelAwards: null
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 2,
    //                 points: 300,
    //                 // levelAwards: null,
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 3,
    //                 points: 500,
    //                 // levelAwards: null,
    //             },
    //             {
    //                 description: '',
    //                 id: '1',
    //                 levelId: 4,
    //                 points: 550,
    //                 // levelAwards: null,
    //             }
    //         ]
    //     }
    // },
    // async getLevels() {
    //     await levelsApiService.getLevels()
    //     .then((response: TypedResponse<LevelRequest[]>) => {
    //         if(response.status === 200) {
    //             this.$state.LevelsRequest = response.data;
    //         }
    //     })
    // }
    setStaticLevels() {
        this.levels = [
            // {
            //     description: '',
            //     id: '1',
            //     levelId: 1,
            //     points: 150,
            // },
            // {
            //     description: '',
            //     id: '2',
            //     levelId: 2,
            //     points: 300,
            // },
            // {
            //     description: '',
            //     id: '3',
            //     levelId: 3,
            //     points: 500,
            // },
            // {
            //     description: '',
            //     id: '4',
            //     levelId: 4,
            //     points: 550,
            // }
            {
                description: '',
                id: '1',
                levelId: 1,
                points: 0,
            },
            {
                description: '',
                id: '2',
                levelId: 2,
                points: 150,
            },
            {
                description: '',
                id: '3',
                levelId: 3,
                points: 300,
            },
            {
                description: '',
                id: '4',
                levelId: 4,
                points: 500,
            },
            {
                description: '',
                id: '5',
                levelId: 5,
                points: 650,
            }
        ]
    },
    async getLevels() {
        await levelsApiService.getLevels()
        .then((response: TypedResponse<LevelRequest[]>) => {
            if(response.status === 200) {
                this.levels = response.data;
            }
        })
    }
  }
})
