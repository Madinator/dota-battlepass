<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useBaseStore } from "@/stores/index";
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRouletteStore } from '@/stores/roulette';

const baseStore = useBaseStore();
const { endLightLineIndicator, previewClosedIndicator } = storeToRefs(baseStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const rouletteStore = useRouletteStore();

const closedIndicator = ref<boolean>(false);
const previewScreen = ref<null | HTMLElement>(null);
const preloaderFinishedIndicator = ref<boolean>(false);

const description = computed(() => {
    if (isRegistered.value) {
        return user.value.level + ' уровень';
    } else {
        return 'Не зарегистрирован';
    }
});

const buttonText = computed(() => {
    if (isRegistered.value) {
        return 'Играть';
    } else {
        return 'Начать';
    }
});

const closedIndicatorNotLoggedIn = ref<boolean>(false);
const closedIndicatorLoggedIn = ref<boolean>(false);

const closeWindow = (): void => {
    closedIndicator.value = true;
    previewClosedIndicator.value = true;
    // authBetBoom();

    if (isRegistered.value) {
        closedIndicatorLoggedIn.value = true;
    } else {
        closedIndicatorNotLoggedIn.value = true;
    }
    
};

watchEffect(() => {
    if (isRegistered.value && closedIndicatorNotLoggedIn.value && previewScreen.value) {
        // rouletteStore.getRoullettes();
        // userStore.getUserInfo();
        previewScreen.value.style.transition = 'none';
        closedIndicator.value = false;
        setTimeout(() => {
            previewScreen.value!.style.transition = 'all .3s';
        }, 200);
    }
})

onMounted(() => {
    setTimeout(() => {
        preloaderFinishedIndicator.value = true;
        previewClosedIndicator.value = true;
    }, 8000);
});
</script>

<template>
    <div ref="previewScreen" :class="{'loggedIn': isRegistered, 'closed': closedIndicator}" class="preview-screen">
        <div class="banner"></div>
        <div class="content">
            <div class="info">
                <img src="@/assets/svg/betboomXDota.svg" alt="" class="logo">
                <!-- <img src="@/assets/svg/gameLogo.svg" alt="" class="game-logo"> -->
                <h1 class="title">Dota Boom</h1>
                <p class="description">Играй каждый день, <br> получай гарантированные бонусы  <br>и шанс выиграть суперпризы!</p>
            </div>
            <div v-if="preloaderFinishedIndicator" class="button-container">
            <!-- <div class="button-container"> -->
                <button @click="closeWindow" class="btn">Вперед</button>
            </div>
            
            <div v-else class="progress-bar-container">
            <!-- <div class="progress-bar-container"> -->
                <div class="progress-bar">
                    <div ref="layerYellow" class="layer layer-yellow"></div>
                </div>
                <div class="active finished my-character">
                    <div class="central-circle">
                        <img src="/characterIcons/Hero_Radiant.png" alt="Hero Radiant" class="event-icon">
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="content">
            <div class="info">
                <img src="@/assets/svg/bannerText.svg" alt="" class="text-image">
            </div>
            <div class="button-container">
                <div class="mini-info">
                    <div v-if="isRegistered" class="avatar"></div>
                    <div class="container">
                        <strong class="subtitle">{{isRegistered && user.nickname || 'Привет, Новенький!'}}</strong>
                        <span class="description">{{description}}</span>
                    </div>
                </div>
                <button @click="closeWindow" class="btn btn-red">{{buttonText}}</button>
            </div>
        </div> -->
    </div>
</template>

<style lang="scss" scoped>
.loggedIn {

    .content {

        .button-container {

            .mini-info {
                justify-content: flex-start !important;
                padding-left: 3.5rem;
            }

            .container {
                align-items: flex-start !important;
            }
        }
    }
}

.closed {
    
        
    .progress-bar-container {

            .progress-bar {
                .layer-yellow {
                    animation: none !important;
                }
            }
        }
        .my-character {
            animation: none !important;
        }
}
.preview-screen {
    @include textureBackground;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--app-height);
    z-index: 1000000;
    // padding: 1.5rem 1rem 4rem;
    padding: 2rem 1rem calc(var(--app-height) / 8);
    transition: all .3s;

    @media only screen and (min-width: 650px) {
        padding: 0;
    }

    .banner {
        position: absolute;
        top: 0;
        left: 0;
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
        height: 100%;
        // transform: scaleX(-1);

        @media only screen and (min-width: 650px) {
            background-image: url(@/assets/img/bannerDesktop.jpg);
        }

        @media only screen and (max-width: 650px) {
            background-image: url(@/assets/img/bannerMobile.jpg);
            background-position: bottom;
        }
    }

    .content {
        // justify-content: space-between;
        position: relative;
        z-index: 1000;
        width: 100%;
        height: 100%;
        padding-top: 2rem;

        @media only screen and (min-width: 650px) {
            height: auto;
            width: auto;
            @include abs-center;
            top: 45%;
        }

        @media only screen and (min-width: 1250px) {
            position: absolute;
            top: 47%;
            // right: 7%;
            // right: -2%;
            left: 60%;
            transform: translateY(-50%);
            @include flex-center;
            flex-direction: column;
            padding-top: 0;
            width: 37rem;
        }

        .info {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;

            .logo {
                width: 25rem;
                margin-bottom: 2rem;

                @media only screen and (min-width: 650px) {
                    width: 22rem;
                }
            }

            .game-logo {
                width: 20rem;
                margin-bottom: 5vh;
            }

            .title {
                font-family: Reaver;
                font-size: 5.3rem;
                text-transform: uppercase;
                margin-bottom: 12vh;
                white-space: nowrap;

                @media only screen and (max-width: 650px) {
                    font-size: 4.7rem;
                }
            }

            .description {
                font-family: Reaver;
                line-height: 1.5;
                // font-size: 1.5rem;
                font-size: 1.7rem;
                // margin-bottom: 12vh;
                margin-bottom: 8vh;
            }
        }

        .button-container {
            @include flex-center;
            width: 33rem;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);

            @media only screen and (min-width: 650px) {
                width: 100%;
                position: static;
                transform: none;
                text-align: center;
                // margin-top: 6rem;
            }

            .btn {
                background-image: linear-gradient(to bottom, #f8682b, #C83F30, #C73E31);
                border: 1px solid #7B4242;
                padding: 1.1rem 0;
                width: 50rem;
                // transform: none !important;

                @media only screen and (min-width: 650px) {
                    padding: 1.1rem 8rem;
                    width: auto;
                }
            }
        }
        
        .progress-bar-container {
            display: flex;
            align-items: center;
            width: 100%;
            height: 2.85rem;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;

            @media only screen and (min-width: 650px) {
                width: 100%;
                position: static;
                transform: none;
            }


            .progress-bar {
                position: relative;
                width: 100%;
                height: 1.4rem;
                background-image: url(@/assets/svg/mapProgressBarBackground.svg);
                background-size: cover;
                background-repeat: no-repeat;
                border-radius: 1.5rem;
                overflow: hidden;

                .layer {
                    position: absolute;
                    top: .2rem;
                    left: .25rem;
                    height: 1rem;
                    border-radius: 1.5rem;
                    transition: all .3s;
                }

                .layer-yellow {
                    background: linear-gradient(180deg, #FFD600 0%, #FFB800 11.77%, #FF8A00 39.37%, #FF8A00 56.04%, #FFB800 89.9%, #FFD600 100%);
                    box-shadow: 0px 0px 4px rgba(255, 200, 60, 0.7), 0px 0px 8px rgba(237, 161, 14, 0.25), 0px 0px 12px rgba(235, 172, 10, 0.5);
                    z-index: 100;

                    animation: width 8s forwards;
                }
            }
        }
        .my-character {
            position: absolute;
            left: 0;
            z-index: 100;
            width: 2.2rem;
            height: 2.2rem;
            border-radius: 100%;
            background-color: var(--color-grey-2);
            animation: position 8s forwards;

            .central-circle {
                @include abs-center;
                @include flex-center;
                width: 1.8rem;
                height: 1.8rem;
                border-radius: 100%;
                box-shadow: inset 0 0 5px rgba(0, 0, 0, .75);
                // background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 78.44%, rgba(0, 0, 0, 0.5) 100%);

                .event-icon {
                    width: 1.4rem;
                    height: 1.4rem;
                }
            }
        }

        .finished {
            .central-circle {
                background-image: radial-gradient(53.12% 53.12% at 50% 50%, #FFAF00 0%, #FF8A00 0.01%, #FF8A00 37.81%, #FFAF00 81.04%, #FFCC00 100%);
                box-shadow: 0px 0px 2px #FFB600;
            }
        }

        .active {
            border-radius: 0;
            background-image: url(@/assets/svg/activeEventItemProgressMap.svg);
            background-color: unset;
            background-size: 100%;
            background-repeat: no-repeat;
            width: 2.6rem;
            height: 2.2rem;
            
            .central-circle {
                width: 2.1rem;
                height: 1.9rem;
                border-radius: 0;
                background-image: url(@/assets/svg/activeFinishedEventItemProgressMap.svg);
                background-size: 100%;
                background-repeat: no-repeat;
                box-shadow: unset;
                left: 49%;

                .event-icon {
                    margin-left: -.2rem;
                }
            }
        }

        // .info {
        //     text-align: center;

        //     .text-image {
        //         width: 33rem;

        //         @media only screen and (min-width: 650px) {
        //             width: 42rem;
        //         }
        //     }
        // }

        // .button-container {
        //     width: 33rem;
        //     position: absolute;
        //     bottom: 0;
        //     left: 50%;
        //     transform: translateX(-50%);

        //     @media only screen and (min-width: 650px) {
        //         width: 33rem;
        //         position: static;
        //         transform: none;
        //         margin-top: 6rem;
        //     }

        //     .mini-info {
        //         @include flex-center;
        //         width: 100%;
        //         height: 6rem;
        //         background-image: url(@/assets/img/bannerHud.jpg);
        //         background-repeat: no-repeat;
        //         background-size: 100%;
        //         margin-bottom: -.2rem;

        //         .avatar {
        //             clip-path: polygon(32% 0%, 100% 0%, 100% 100%, 0% 100%);
        //             background-image: url(@/assets/myCharacter.gif);
        //             background-size: cover;
        //             border-radius: 3px;
        //             position: relative;
        //             height: 5.5rem;
        //             width: 5rem;
        //             margin-right: 1rem;
        //         }

        //         .container {
        //             display: flex;
        //             flex-direction: column;
        //             align-items: center;

        //             .subtitle {
        //                 color: transparent;
        //                 background-color: #C9DEE7;
        //                 text-shadow: 0px 2px 2px rgba(#000000, 32%),
        //                 0px -1px 1px rgba(#FFFFFF, 25%);
        //                 -webkit-background-clip: text;
        //                 -moz-background-clip: text;
        //                 background-clip: text;
        //                 margin-bottom: .5rem;
        //             }

        //             .description {
        //                 color: transparent;
        //                 background-color: #77888F;
        //                 text-shadow: 0px 2px 2px rgba(#000000, 32%),
        //                 0px -1px 1px rgba(#FFFFFF, 25%);
        //                 -webkit-background-clip: text;
        //                 -moz-background-clip: text;
        //                 background-clip: text;
        //                 font-size: 1.2rem;
        //             }
        //         }
        //     }

        //     .btn {
        //         width: 100%;
        //         padding: 1.4rem 0;
        //     }
        // }
    }
}

@keyframes width {
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
}

@keyframes position {
    0% {
        // transform: translateX(0);
        left: 0;
    }
    100% {
        // transform: translateX(100%);
        left: 95%;
    }
}
</style>