<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from '@vue/runtime-core';
import PlatformCard from '@/components/platformCard.vue';
import { useQuestsStore } from '@/stores/quests';
import { QuestCategories } from '@/services/api/quests/index';
import { useUserStore } from '@/stores/user';
import { useRouletteStore } from "@/stores/roulette";
import { useAuthStore } from '@/stores/auth';

const roulettStore = useRouletteStore();

const questsStore = useQuestsStore();
const { data } = storeToRefs(questsStore);

const userStore = useUserStore();
const { prizes } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const findPrizeImg = ((id: string | null) => {
    return prizes.value.filter(item => item.prizeId === id)[0];
})

onMounted(() => {
    questsStore.getQuestList();
    roulettStore.getRoullettes();
    getUpdateQuestsTime();
});

const typedPrice = (price: number): void => {
    questsStore.setActiveSample(price);
};

const updateTime = ref('');
const getUpdateQuestsTime = () => {
    setInterval(() => {
        let currentDate = new Date();
        let endDate = new Date(data.value.endAt);

        let diff = (endDate.getTime() - currentDate.getTime()) / (1000 * 60);
        let diffInMinutes = diff / 60;

        var hours = (diffInMinutes / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);

        updateTime.value = `${rhours}:${rminutes < 10 ? '0' + rminutes : rminutes}`
    }, 1000)
};

const bet = () => {
    window.parent.postMessage({"module_id":"esport","action":"goTo","route":"esport"}, '*')
}

const register = () => {
    // window.parent.postMessage({ type: 'betboom_auth' });
    window.parent.postMessage({ type: 'betboom_register' }, '*');
}

const auth = (): void => {
    // authStore.login('RU', 'e586519d-5932-4ce3-9fd4-246e6fde5a3e');
    // window.parent.postMessage({ type: 'betboom_auth' });
    window.parent.postMessage({ type: 'betboom_register' }, '*');
    userStore.getUserInfo();
}
</script>

<template>
    <div class="tasks-page" >
        <header class="header">
            <div class="header--mobile">
                <span class="spin-amount"><span class="spin-amount__amount">1</span><span class="spin-amount__spin">Ход</span></span>
                <img class="spin-img" src="@/assets/svg/doubleTrapezoid.svg" alt=""/>
            </div>
        </header>
        <section class="option">
            <div class="get-spin">
                <h1 class="get-spin__text">Следующий ход через</h1>
                <span class="get-spin__time">23:05</span>
            </div>
            <div class="or">
                <div class="or__line"></div>
                <span class="or__text">Или</span>
                <div class="or__line"></div>
            </div>
            <div class="make-deposit" v-if="isRegistered">
                <div class="make-deposit__header">
                    <img class="make-deposit__img" src="@/assets/svg/bbLogo24.svg" alt=""/>
                    <label class="make-deposit__title">Сделай ставку на киберспорт</label>
                </div>
                <div class="make-deposit__main">
                    <div class="make-deposit__line"></div>
                    <div class="make-deposit__info">
                        <span class="make-deposit__price">1000 ₽</span>
                        <span class="make-deposit__spine">1 ход</span>
                    </div>
                    <div class="make-deposit__line"></div>
                    <div class="make-deposit__info">
                        <span class="make-deposit__price">2000 ₽</span>
                        <span class="make-deposit__spine">15 ходов</span>
                    </div>
                    <div class="make-deposit__line"></div>
                    <div class="make-deposit__info">
                        <span class="make-deposit__price">5000 ₽</span>
                        <span class="make-deposit__spine">38 ходов</span>
                    </div>
                    <div class="make-deposit__line"></div>
                </div>
                <button class="make-deposit__button btn btn-green" @click="bet()">Сделать Ставку</button>
                <div class="make-deposit__line-bottom"></div>
            </div>
            <div class="reg" v-if="!isRegistered">
                <span class="reg__text">Зарегестриструйся, чтобы получать получать призы</span>
                <button class="reg__button base-button button-green" @click="auth">Регистрация</button>
            </div>
        </section>
        <section class="main" :style="isRegistered ? '' : 'filter:blur(6px)'">
            <h1 class="main__title">Выполни задания</h1>
            <div class="time">
                <div class="time__header">
                    <img class="time__img" src="@/assets/svg/bbLogo32.svg" alt=""/>
                    <span class="time__title">Ежедневные задания BetBoom</span>
                </div>
                <span class="time__time">До обновления: {{updateTime}}</span>
            </div>
            <div class="cards">
                <PlatformCard 
                    v-for="item in data.quests.filter(item => item.category===QuestCategories.BETBOOM)" 
                    :data="item" :key="item.id" 
                    :prize="findPrizeImg(item.prizeId)"
                     />
            </div>
            <div class="time">
                <div class="time__header">
                    <span class="time__title">Социальные задания</span>
                </div>
                <span class="time__time">До обновления: {{updateTime}}</span>
            </div>
            <div class="cards">
                <PlatformCard v-for="item in data.quests.filter(item => item.category===QuestCategories.SOCIALS)" :data="item" :key="item.id"/>
            </div>
            <div class="time">
                <div class="time__header">
                    <span class="time__title">Игровые задания DOTA 2</span>
                </div>
                <span class="time__time">До обновления: {{updateTime}}</span>
            </div>
            <div class="cards">
                <PlatformCard v-for="item in data.quests.filter(item => item.category===QuestCategories.GAMESDAILY)" :data="item" :key="item.id"/>
            </div>
            <div class="time">
                <div class="time__header">
                    <span class="time__title">Игровые задания DOTA 2</span>
                </div>
                <span class="time__time">Не обновляются</span>
            </div>
            <div class="cards">
                <PlatformCard v-for="item in data.quests.filter(item => item.category===QuestCategories.GAMESOVERALL)" :data="item" :key="item.id"/>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
    .tasks-page {
        overflow-y: scroll;
        margin: 0 auto;
        max-width: 912px;
        padding-bottom: 7rem;

        @media only screen and (min-width: 850px) {
            padding-top: 4rem;
            padding-bottom: 2rem;
        }
    }
    .header {
        &--mobile {
            position: relative;
            display: flex;
            justify-content: center;
        }
    }
    .option {
        padding: 0 16px;
    }
    .spin-amount {
        position: absolute;
        text-align: center;
        padding-top: 10px;
        text-shadow: 0px 2px 4px #000000;
        &__amount {
            font-family: Reaver;
            font-weight: 700;
            font-size: 20px;
            &::after {
                content: "\a";
                white-space: pre;
            }
        }
        &__spin {
            font-family: "Gilroy";
            font-weight: 500;
            font-size: 10px;
        }
    }
    .get-spin {
        text-align: center;
        display: flex;
        flex-flow: column;
        margin-top: 16px;
        &__text {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            @media (min-width: 930px) {
                font-size: 20px;
            }
        }
        &__time {
            font-family: Reaver;
            font-style: normal;
            font-weight: 700;
            font-size: 48px;
            line-height: 48px;
            @media (min-width: 930px) {
                margin-top: 16px;
                font-size: 120px;
                line-height: 120px;
            }
        }
    }
    .or {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-top: 16px;
        @media (min-width: 930px) {
            margin-top: 40px;
        }
        &__line {
            width: -webkit-fill-available;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        &__text {
            font-family: Reaver;
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            @media (min-width: 930px) {
                font-size: 24px;
                line-height: 24px;
            }
        }
        
    }
    .make-deposit {
        display: flex;
        flex-flow: column;
        margin-top: 48px;
        justify-content: center;
        &__header {
            display: flex;
            justify-content: center;
            @media (min-width: 930px) {
                justify-content: left;
            }
        }
        &__title {
            margin-left: 16px;
            font-family: Reaver;
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 24px;
        }
        &__main {
            margin-top: 32px;
            display: flex;
            flex-flow: row;
            justify-content: space-between;

        }
        &__line {
            border-left: 1px solid rgba(255, 255, 255, 0.2);
            // @media (max-width: 930px) {
            //     display: none;
            // }
        }
        &__info {
            display: flex;
            flex-flow: column;
        }
        &__price {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 700;
            font-size: 40px;
            line-height: 40px;
            @media (max-width: 930px) {
                font-size: 20px;
            }
        }
        &__spine {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 19px;
        }
        &__button {
            width: 220px;
            margin: 32px auto 0;
            padding: 12px 0;
            filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.5));
            @media (max-width: 930px) {
                width: 100%;
            }
        }
        &__line-bottom {
            margin-top: 48px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            @media (max-width: 930px) {
                display: none;
            }
        }
    }
    .reg {
        display: flex;
        flex-flow: column;
        align-items: center;
        gap: 40px;
        @media (max-width: 930px) {
            gap: 16px
        }
        &__text {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 32px;
            line-height: 32px;
            @media (max-width: 930px) {
                font-size: 20px;
                text-align: center;
            }
        }
        &__button {
            width: 288px;
            font-family: 'Reaver';
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 32px;
        }
    }
    .main {
        padding: 40px 16px 0;
        &__title {
            font-family: 'Reaver';
            font-style: normal;
            font-weight: 600;
            font-size: 26px;
            line-height: 32px;
        }
    }
    .time {
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
        padding-right: 16px;
        @media (max-width: 930px) {
            display: flex;
            flex-flow: column;
        }
        &__header {
            display: flex;
            flex-flow: row;
            gap: 16px;
            align-items: center;
            @media (max-width: 930px) {
                align-items: end;
            }
        }
        &__title {
            font-family: 'Reaver';
            font-style: normal;
            font-weight: 700;
            font-size: 22px;
            line-height: 24px;
        }
        &__time {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
        }
    }
    .cards {
        display: flex;
        flex-flow: column;
        width: 100%;
        gap: 16px;
        @media (min-width: 930px) {
            flex-flow: row wrap;
            min-width: 290px;
        }
    }
    .navigation {
        position: fixed;
        &--mobile {
            top: auto;
            bottom: 0;
        }
        &--desktop {
            top: 0;
        }
    }
</style>
