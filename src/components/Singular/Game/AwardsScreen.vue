<script setup lang="ts">
import { useBaseStore } from '@/stores/index';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useLevelsStore } from '@/stores/levels';
import { useEventsStore } from '@/stores/events';
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import AwardComp from "@/components/Reusable/Game/Award.vue";
import type Award from "@/interfaces/award";

const baseStore = useBaseStore();
const { isAwardsWindowOpened, awardScreenType } = storeToRefs(baseStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const levelStore = useLevelsStore();
const { levels } = storeToRefs(levelStore);

const eventsStore = useEventsStore();
const { fightEvents, prizesForLevels, allPrizes } = storeToRefs(eventsStore);

let startAnimation = ref<boolean>(false);

let awardsSectionOpenIndicator = ref<boolean>(false);

// const awards = computed(() => {
//     if (!user.value.currentEventId) return;
//     const currentEvent = fightEvents.value.find(el => {
//         return el.id === user.value.currentEventId;
//     })
//     return currentEvent?.awards;
// });

// const awards = ref<any>([
//     {
//         description: "Fragstore №1",
//         title: "Fragstore №1",
//     },
//     {
//         description: "Fragstore №2",
//         title: "Fragstore №2",
//     },
//     {
//         description: "Fragstore №3",
//         title: "Fragstore №3",
//     },
//     {
//         description: "Fragstore №4",
//         title: "Fragstore №4",
//     }
// ])

const awards = computed(() => {
    if (!isRegistered.value) return [];
    const prizesArrayStarter = prizesForLevels.value.find(el => {
        return el.levelId === user.value.level - 1;
    })

    if (!prizesArrayStarter) return [];

    const prizes = prizesArrayStarter.levelPrizes.map(el => {
        return allPrizes.value.find(el2 => {
            return el2.id === el.id;
        })
    })

    return prizes;
})


// const awards = ref<Award[]>([
//     {
//         type: 'coupon',
//         couponNumber: 1,
//         amount: 1
//     }
// ]);

// const awards = computed(() => {
    // if (awardScreenType.value === 'event') {
    //     return fightEvents.value.find(el => {
    //         return el.userLevel === user.value.level;
    //     })?.awards;
    // } else if (awardScreenType.value === 'level') {
    //     return levels.value.find(el => {
    //         return el.levelId === user.value.level - 1;
    //     })?.levelAwards;
    // }
// })

watchEffect(() => {
    // if (isAwardsWindowOpened.value && ((awards.value && awards.value.length > 0) || awardScreenType.value === 'level' && user.value.level > 1)) {
    if (isAwardsWindowOpened.value) {
        // awards.value?.forEach(el => {
        //     if (el.type === 'xp') {
        //         user.value.xp += el.amount;
        //     } else if (el.type === 'spin') {
        //         user.value.spins += 1;
        //     }
        // });
        setTimeout(() => {
            startAnimation.value = true;
        }, 300);
    } else {
        startAnimation.value = false;
    }
});

// watch(user.value.level, (newVal, oldVal) => {
//     if (oldVal)
// })

const title = computed(() => {
    if (awardScreenType.value === 'event') {
        return 'Награда';
    } else if (awardScreenType.value === 'level') {
        return user.value.level + ' уровень';
    }
});

const closeWindow = (): void => {
    if (!awards.value || awards.value.length <= 1) {
        isAwardsWindowOpened.value = false;
        return;
    }
    if (!awardsSectionOpenIndicator.value) {
        awardsSectionOpenIndicator.value = true;
    } else {
        isAwardsWindowOpened.value = false;
        setTimeout(() => {
            awardsSectionOpenIndicator.value = false;
        }, 200);
    }
};

const closeWindowOnWrapper = (event: Event): void => {
    const target = event.target as HTMLElement;
    if ((window.outerWidth > 850 && (target.classList.contains('awards-screen') || target.classList.contains('background'))) ||
   ( window.outerWidth <= 850 && (target.classList.contains('awards-screen') || target.classList.contains('awards-window') || target.classList.contains('background')))) {
        closeWindow();
        return;
    }
};

const lightWidth = computed(() => {
    if (!awards.value || awards.value?.length < 1) {
        if (window?.outerWidth > 600) {
            return '62rem';
        } else {
            return '30rem';
        }
    } else if (awards.value?.length < 2) {
        if (window?.outerWidth > 600) {
            return '65rem';
        } else {
            return '62rem';
        }
    } else {
        if (window?.outerWidth > 600) {
            return '70rem';
        } else {
            return '68rem';
        }
    }
})

// const isMobileVersion = computed(() => {
//     if (window?.outerWidth > 600) {
//         return false;
//     } else {
//         return true;
//     }
// })
const isMobileVersion = ref<boolean>(true);

watchEffect(() => {
    if (window?.outerWidth > 600) {
        isMobileVersion.value = false;
    } else {
        isMobileVersion.value = true;
    }
})

// watchEffect(() => {
//     if (!((awards.value && awards.value.length > 0) || awardScreenType.value === 'level' && user.value.level > 1) && isAwardsWindowOpened.value) {
//         isAwardsWindowOpened.value = false;
//     }
// })

onMounted(() => {
    window.addEventListener('resize', () => {
        if (window?.outerWidth > 600) {
            isMobileVersion.value = false;
        } else {
            isMobileVersion.value = true;
        }
    })
})

// watchEffect(() => {
//     if (!awards.value || awards.value.length <= 0) {
//         isAwardsWindowOpened.value = false;
//     }
// })

</script>

<template>
    <Transition name="fade">
        <!-- <div class="awards-screen"> -->
        <div @click="closeWindowOnWrapper"
         :class="{'closed': !isAwardsWindowOpened, 'animation': startAnimation}" class="awards-screen">
            <img v-if="awards && awards.length > 0 && !isMobileVersion && awardsSectionOpenIndicator" :style="{'width': lightWidth}" src="@/assets/img/light.png" alt="" class="light">
            <div v-if="awards && awards.length > 0" :class="{'closed': !awardsSectionOpenIndicator}" class="awards-window">
                <button @click="closeWindow" class="close-button">
                    <img src="@/assets/svg/crossGradient.svg" alt="Cross" class="cross">
                </button>
                <div class="awards">
                    <h2 class="title">Награда</h2>
                    <img v-if="isMobileVersion" :style="{'width': lightWidth}" src="@/assets/img/light.png" alt="" class="light">
                    <AwardComp
                        v-for="(award, index) in awards"
                        :key="index"
                        :title="award?.title"
                        :description="award?.description"
                        :points="award?.points"
                    />
                </div>
                <div class="buttons">
                    <button @click="closeWindow" class="btn btn-green">Далее</button>
                    <router-link @click="closeWindow" to="/account" class="btn btn-transparent">Аккаунт</router-link>
                </div>
            </div>

            <div :class="{'closed': awardsSectionOpenIndicator}" class="gotten-value">
                <img src="@/assets/img/light.png" alt="" class="light">
                <div class="inner-container">
                    <strong class="title">{{user.level}}</strong>
                    <span class="subtitle">Новый уровень</span>
                </div>
            </div>
            <div :class="{'closed': awardsSectionOpenIndicator}" class="new-level-window">
                <AwardComp
                    class="award-comp"
                    key="newLevelMessage"
                    type="newLevelMessage"
                    :amount="1"
                />
                <div class="buttons">
                    <button @click="closeWindow" class="btn btn-green">Далее</button>
                    <router-link @click="closeWindow" to="/account" class="btn btn-transparent">Аккаунт</router-link>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style lang="scss" scoped>
span,
p {
    font-size: 16px;
}

.awards-screen.closed {

    .light {
        animation: none !important;
    }
}

.awards-screen.animation {
    .light {
        opacity: 1 !important;
    }

    ::v-deep(.award) {
        @media only screen and (max-width: 600px) {
            box-shadow: 0px 0px 50px -18px rgba(64, 134, 100, 0.3), 0px 0px 120px rgba(#3B6350, .9);
        }
    }

    .awards-window {

        @media only screen and (min-width: 600px) {
            box-shadow: 0px 0px 50px -18px rgba(64, 134, 100, 0.3), 0px 0px 220px rgba(#3B6350, .9);
        }
    }
}
    
.awards-screen {
    // @include flex-center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100000;
    width: 100%;
    height: var(--app-height);
    background: linear-gradient(180deg, rgba(10, 11, 35, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
    // backdrop-filter: blur(14px);
    transition: all .3s;
    
    // .background {
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     width: 100%;
    //     height: 100%;
    //     background: linear-gradient(180deg, rgba(10, 11, 35, 0.85) 0%, rgba(0, 0, 0, 0.85) 100%);
    //     filter: blur(14px);
    //     inset: 3%;
    //     z-index: 100;
    // }

    .light {
        @include abs-center;
        width: 70rem;
        animation: rotation 60s linear infinite alternate;
        opacity: 0;
        transition: all .3s;
    }
    .awards-window,
    .new-level-window {
        position: relative;
        height: var(--app-height);
        width: 100%;
        padding: 3rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 1000;
        transition: all .3s;

        @media only screen and (max-width: 600px) {
            max-height: 900px;
        }

        @media only screen and (min-width: 600px) {
            height: auto;
            background-color: #191A1E;
            @include textureBackground;
            padding: 27px;
            width: unset;
            padding-bottom: 10px;
            // box-shadow: 0px 0px 50px -18px rgba(64, 134, 100, 0.3), 0px 0px 220px rgba(#3B6350, .9);
        }

        @media only screen and (min-width: 600px) {
            transform: scale(.85);
        }

        .close-button {
            position: absolute;
            top: 1.6rem;
            right: 1.6rem;
            width: 20px;
            height: 20px;

            .cross {
                width: 100%;
                height: 100%;
            }
        }

        .subtitle {
            position: relative;
            z-index: 100;
            display: inline-block;
            margin-bottom: .5rem;
        }

        .title {
            position: relative;
            z-index: 100;
            font-family: Reaver;
            font-size: 2.4rem;
            text-align: center;
            margin-bottom: 1.6rem;

            @media only screen and (min-width: 600px) {
                margin-bottom: 1rem;
            }
        }

        .awards {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;

            // @media only screen and (max-width: 600px) {
            //     box-shadow:  0px 0px 50px -18px rgba(64, 134, 100, 0.3),  0px 0px 220px rgba(#3B6350, .9);
            // }

            // @media only screen and (max-width: 600px) {
            //     position: absolute;
            //     top: 0;
            //     left: 0;
            //     height: 100vh;
            //     max-height: 100vh;
            //     overflow-y: scroll;
            //     padding-bottom: 10vh;
            // }
        }
    }

    .new-level-window {

        // @media only screen and (min-width: 600px) {
            height: auto;
            background-color: #191A1E;
            @include textureBackground;
            @include abs-center;
            top: 80%;
            width: 28rem;
            padding: 17px;
            padding-bottom: 10px;
        // }
        @media only screen and (min-width: 600px) {
            transform: translate(-50%, -50%) scale(.85);
        }

        .buttons {
            position: static !important;
            transform: unset !important;
            margin-top: 1.5rem !important;
            width: 100% !important;
        }
    }
    
    .gotten-value {
        @include abs-center;
        top: 40%;
        width: 32rem;
        height: 10rem;
        transition: all .6s;
        filter: drop-shadow(0px 0px 20px #3B6350);

        // @media only screen and (max-width: 850px) and (max-height: 750px) {
        //     bottom: 70vh;
        // }

        // @media only screen and (min-width: 850px) {
        //     bottom: 68vh;
        //     transform: translateX(-50%) scale(.9);
        // }

        .light {

            // @media only screen and (max-width: 600px) {
                @include abs-center;
                width: 35rem;
            // }
        }

        .inner-container {
            @include flex-center;
            flex-direction: column;
            background-image: url(@/assets/img/rouletteAwardBackground.png);
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            height: 100%;
            width: 100%;
            filter: drop-shadow(0px 0px 50px #3B6350);
        }

        .title {
            @include yellowGradientText;
            text-shadow: none;
            font-family: Reaver;
            font-size: 4.15rem;
        }

        .subtitle {
            font-size: 1.6rem;
        }
    }

    .buttons {
        position: absolute;
        // bottom: 2.4rem;
        // bottom: 4rem;
        bottom: calc(var(--app-height) / 10);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        width: 90%;

        @media only screen and (min-width: 450px) {
            width: 39rem;
        }

        @media only screen and (min-width: 600px) {
            position: static;
            transform: unset;
            margin-top: 1.5rem;
            width: 100%;
        }

        .btn {
            width: 100%;
        }

        .btn-green {
            margin-bottom: .5rem;
        }
    }
}

@keyframes rotation {
    0% {
        transform: translate(-50%, -50%) rotate(0);
    }
    50% {
        transform: translate(-50%, -50%) rotate(720deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(0);
    }
}
</style>