<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

interface Props {
    type?: 'xp' | 'spin' | 'money' | 'coupon' | 'fragstoreNumber' | 'fragstorePercent' | "raffleTicket" | 'newLevelMessage' | 'registrationMoney';
    couponNumber?: number;
    fragstoreNumberNumber?: number;
    amount?: number;

    title?: string | undefined;
    description?: string | undefined;
    points?: number | undefined;
}

const props = defineProps<Props>();
const imageContainer = ref<null | HTMLElement>(null);

const numberWithSpaces = (number: number): string => {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
};

let amountStart = ref<number>(1);
let couponNumberStart = ref<null | number>(null);
let fragstoreNumberNumberStart = ref<null | number>(null);

const type = computed<'xp' | 'spin' | 'money' | 'coupon' | 'fragstoreNumber' | 'fragstorePercent' | "raffleTicket" | 'newLevelMessage' | 'registrationMoney' | undefined>(() => {
    if (props.type) {
        return props.type;
    } else {
        if (props.title) {
            const title = props.title.toLowerCase();
            if (title.includes('спин') || title.includes('spin')) {
                amountStart.value = 1;
                return 'spin';
            } else if (title.includes('купон') || title.includes('coupon')) {
                const number = title.match(/(\d+)/);
                if (number) {
                    couponNumberStart.value = +number[0];
                    // console.log('COUPON', couponNumberStart.value)
                }
                amountStart.value = 1;
                return 'coupon';
            } else if (title.includes('fragstore') && title.includes('%')) {
                const number = title.match(/(\d+)/);
                if (number && +number[0]) {
                    // if (+number[0] === 5) {
                    //     fragstoreNumberNumberStart.value = 1;
                    // } else if (+number[0] === 10) {
                    //     fragstoreNumberNumberStart.value = 2;
                    // } else if (+number[0] === 15) {
                    //     fragstoreNumberNumberStart.value = 3;
                    // } else {
                    //     fragstoreNumberNumberStart.value = 3;
                    // }

                    fragstoreNumberNumberStart.value = +number[0];
                }
                amountStart.value = 1;
                return 'fragstorePercent';
            } else if (title.includes('fragstore') && title.includes('№')) {
                const number = title.match(/(\d+)/);
                if (number) {
                    // if (+number[0] === 5) {
                    //     fragstoreNumberNumberStart.value = 1;
                    // } else if (+number[0] === 10) {
                    //     fragstoreNumberNumberStart.value = 2;
                    // } else if (+number[0] === 15) {
                    //     fragstoreNumberNumberStart.value = 3;
                    // } else if (+number[0] === 20) {
                    //     fragstoreNumberNumberStart.value = 4;
                    // }
                    
                    fragstoreNumberNumberStart.value = +number[0];
                }
                amountStart.value = 1;
                return 'fragstoreNumber';
            } else if (title.includes('money') || title.includes('freebet') ||
            title.includes('деньги')) {
                const number = title.match(/(\d+)/);
                if (number) {
                    amountStart.value = +number[0];
                }
                return 'money';
            } else if (title.includes('опыт') || title.includes('exp') || title.includes('xp')) {
                if (props.points) {
                    amountStart.value = props.points;
                }
                return 'xp';
            } else if (title.includes('raffle')) {
                amountStart.value = 1;
                return 'raffleTicket';
            } 
        } else {
            return 'xp';
        }
    }
})

const amount = computed<number>(() => {
    if (props.amount) {
        return props.amount;
    } else {
        return amountStart.value;
    }
});

const couponNumber = computed<number | null>(() => {
    if (props.couponNumber) {
        return props.couponNumber;
    } else {
        return couponNumberStart.value;
    }
});


const fragstoreNumberNumber = computed<number | null>(() => {
    if (props.fragstoreNumberNumber) {
        return props.fragstoreNumberNumber;
    } else {
        return fragstoreNumberNumberStart.value;
    }
});


const awardImage = computed(() => {
    if (type.value === 'xp') {
        return 'xpAwardBackground';
    } else if (type.value === 'spin') {
        return 'freeSpinAwardBackground';
    } else if (type.value === 'money' || type.value === 'registrationMoney') {
        return 'moneyAward' + amount.value + 'Background';
    } else if (type.value === 'coupon') {
        return 'coupon' + couponNumber.value;
    } else if (type.value === 'fragstoreNumber') {
        return 'promocode' + fragstoreNumberNumber.value;
    } else if (type.value === 'fragstorePercent') {
        return 'fragstore%';
    } else if (type.value === 'raffleTicket') {
        return 'raffleTicket';
    }
    return;
});

const awardSubtitle = computed(() => {
    if (type.value === 'xp') {
        return '+XP';
    } else if (type.value === 'spin') {
        return '+' + amount.value + ' ХОД';
    } else if (type.value === 'money' || type.value === 'registrationMoney') {
        return numberWithSpaces(amount.value);
    } else if (type.value === 'coupon') {
        return '№' + couponNumber.value;
    } else if (type.value === 'fragstoreNumber') {
        return '№' + fragstoreNumberNumber.value;
    } else if (type.value === 'fragstorePercent') {
        return fragstoreNumberNumber.value + '%';
    }
    return;
});

const awardTitle = computed(() => {
    if (type.value === 'xp') {
        return amount.value + ' XP';
    } else if (type.value === 'spin') {
        if (amount.value === 1) {
            return 'Бесплатный ход';
        } else if (amount.value >= 2 && amount.value < 5) {
            return amount.value + 'бесплатных хода';
        } else {
            return amount.value + 'бесплатных ходов'
        }
    } else if (type.value === 'money' || type.value === 'registrationMoney') {
        return numberWithSpaces(amount.value) + ' ₽';
    } else if (type.value === 'coupon') {
        if (couponNumber.value === 5) {
            return 'Купон на розыгрыш главного приза';
        } else {
            return 'Купон на розыгрыш №' + couponNumber.value;
        }
    } else if (type.value === 'fragstoreNumber') {
        return 'Fragstore №' + fragstoreNumberNumber.value;
    } else if (type.value === 'fragstorePercent') {
        return 'Fragstore ' + fragstoreNumberNumber.value + '%';
    } else if (type.value === 'newLevelMessage') {
        return 'Доступен новый этап';
    } else if (type.value === 'raffleTicket') {
        return 'Raffle Ticket';
    }
    return;
});

const awardDescription = computed(() => {
    if (type.value === 'xp') {
        return 'Получение опыта';
        return;
    } else if (type.value === 'spin') {
        if (amount.value === 1) {
            return 'Ходи еще раз';
        } else if (amount.value >= 2 && amount.value < 5) {
            return 'Ходи еще ' + amount.value + ' раза';
        } else {
            return 'Ходи еще ' + amount.value + ' раз'
        }
    } else if (type.value === 'money') {
        return 'Фрибет на Betboom';
    } else if (type.value === 'coupon') {
        if (couponNumber.value === 5) {
            return `Полностью оснастим твое игровое место для киберспорта: 
            компьютер, монитор, наушники, мышь, клавиатура и стол с игровым креслом`;
        } else {
            let sertificatsAmount = '1 000 ₽ (100 шт.)';
            let freebet = '5 000 ₽ (100 шт.)';
            if (couponNumber.value === 2) {
                sertificatsAmount = '3 000 ₽ (100 шт.)';
                freebet = '10 000 ₽ (100 шт.)';
            } else if (couponNumber.value === 3) {
                sertificatsAmount = '5 000 ₽ (50 шт.)';
                freebet = '20 000 ₽ (50 шт.)';
            } else if (couponNumber.value === 4) {
                sertificatsAmount = '10 000 ₽ (20 шт.)';
                freebet = '50 000 ₽ (10 шт.)';
            }
            return `Сертификаты на ${sertificatsAmount} 
            Фрибеты на ${freebet}`;
        }
    } else if (type.value === 'fragstoreNumber') {
        if (fragstoreNumberNumber.value === 1) {
            return 'Сертификат 1 000 ₽  FKTVfdf11EUG444dfd';
        } else if (fragstoreNumberNumber.value === 2) {
            return 'Сертификат 3 000 ₽  EUG444dfdFKTVfdf11';
        } else if (fragstoreNumberNumber.value === 3) {
            return 'Сертификат 5 000 ₽  1EUGVfdf11EUG41EUG';
        } else if (fragstoreNumberNumber.value === 4) {
            return 'Сертификат 10 000 ₽  Vfdf11EUGVfdf11dvF3fd';
        }
    } else if (type.value === 'fragstorePercent') {
        return 'Промокод на скидку INT' + fragstoreNumberNumber.value;
    } else if (type.value === 'registrationMoney') {
        return 'Фрибет на Betboom';
    }
    return;
});

onMounted(() => {
    if (type.value === 'coupon' && couponNumber.value === 5 && imageContainer.value) {
        imageContainer.value.style.backgroundImage = 'url(/awardsBackgrounds/coupon5AwardImageBackground.svg)';
    } else if (type.value === 'fragstoreNumber' && fragstoreNumberNumber.value === 5 && imageContainer.value) {
        imageContainer.value.style.backgroundImage = 'url(/awardsBackgrounds/promocode4AwardImageBackground.svg)';
    } else if (type.value === 'fragstorePercent' && imageContainer.value) {
        imageContainer.value.style.backgroundImage = `url(/awardsBackgrounds/fragstore${fragstoreNumberNumber.value}%AwardImageBackground.svg)`;
    }
})
</script>

<template>
    <div :class="type" class="award">
        <img src="@/assets/svg/awardLine.svg" alt="" class="border-line">
        <div class="content">
            <div class="flex-container">
                <div v-if="type !== 'newLevelMessage'" ref="imageContainer" class="image-container">
                    <span class="award-subtitle">{{awardSubtitle}}</span>
                    <img :src="'/awardsBackgrounds/' + awardImage + '.png'" alt="Award image" class="image">
                </div>
                <img v-if="type === 'newLevelMessage'" src="@/assets/svg/checkMark.svg" alt="Check mark" class="check-mark">
                <div class="info">
                    <strong class="title">{{awardTitle}}</strong>
                    <p v-if="type !== 'newLevelMessage'" class="description">{{awardDescription}}</p>
                </div>
            </div>
            <!-- <a v-if="type === 'money'" href="#" class="btn btn-yellow">Получить награду</a> -->
        </div>
        <!-- <div v-else class="money-award-content">
            <div class="info">
                <strong class="title">{{amount}}</strong>
                <strong class="subtitle">рублей</strong>
                <p class="description">Бесплатной ставки на BetBoom</p>
                <a href="#" class="btn btn-yellow">Получить награду</a>
            </div>
            <img src="@/assets/svg/dollarSign.svg" alt="" class="dollar-sign">
        </div> -->
    </div>
</template>

<style lang="scss" scoped>
span,
p {
  font-size: 16px;
}

.vip {
    .info {

        .title {
            @include yellowGradientText;
        }
    }
}

// .award.xp {

//     .content {

//     }
// }

.award.spin {

    .content {


        .image-container  {

            .award-subtitle {
                display: inline-block;
                width: 80%;
                white-space: pre-wrap;
            }
        }
    }
}

// .award.money,
// .award.registrationMoney {

//     .content {

//     }
// }
.award.registrationMoney {

    .content {


        .image-container  {

            .image {
                bottom: 9px !important;
            }
        }
    }
}

.award.raffleTicket {

    .content {
        

        .image-container {


            .image {
                @include abs-center;
                width: 90%;
            }
        }
    }
}

.award.fragstorePercent {

    .content {
        

        .image-container {


            .image {
                bottom: 8.5px;
                left: 50.8%;
                transform: translateX(-50%);
                width: 55%;
            }
        }
    }
}

.award.coupon {

    .content {

        .btn {
            margin-top: 15px;
            width: 100%;
        }

        .info {
            width: 90% !important;

            .description {
                width: 80%;

                @media only screen and (max-width: 900px) {
                    width: 80%;
                }

                @media only screen and (max-width: 700px) {
                    width: 90%;
                }

                @media only screen and (max-width: 500px) {
                    width: 95%;
                }

                @media only screen and (min-width: 900px) {
                    width: 65%;
                }
            }
        }
    }
}

.award.newLevelMessage {
    width: 100%;
    .check-mark {
        width: 30px;
        height: 30px;
        margin-right: 15px;
    }

    .info {

        @media only screen and (max-width: 400px) {
            width: 100% !important;
        }

        .title {
            margin-bottom: 0 !important;
        }
    }
}

.award-short {
    background: unset !important;
    width: auto !important;
    margin-bottom: 0 !important;
    box-shadow: none !important;

    .info, .btn, .border-line {
        display: none !important;
    }

    .content {
        padding: 0 !important;
    }

    .image-container {
        margin: 0 7px !important;
    }
}

.award-column {
    background: unset !important;
    width: 100% !important;
    margin-bottom: 0 !important;
    display: flex;
    justify-content: center;

    @media only screen and (min-width: 450px) {
        width: 390px !important;
    }

    .border-line {
        display: none !important;
    }

    .content {

        .flex-container {
            flex-direction: column;
        }

        .image-container {
            margin-right: 0 !important;
            margin-bottom: 1rem !important;
            // width: 90vw !important;
            // height: 90vw !important;

            @media only screen and (min-width: 450px) {
                width: 390px !important;
                height: 390px !important;
            }

            .image {
                bottom: 9px !important;
            }

            .award-subtitle {
                top: 20px !important;
                font-size: 65px !important;
            }
        }

        .info {
            width: 270px !important;

            .title {
                font-size: 2.4rem !important;
                margin-bottom: 5px !important;
            }

            .description {
                font-size: 1.8rem !important;
            }
        }

        .btn {
            display: none !important;
        }
    }
}

.award {
    position: relative;
    @include textureBackground;
    // width: 350px;
    width: 90%;
    margin-bottom: 8px;
    // flex-grow: 1;
    transition: all .3s;

    @media only screen and (min-width: 450px) {
        width: 39rem;
    }

    // @media only screen and (max-width: 600px) {
    //     box-shadow: 0px 0px 50px -18px rgba(64, 134, 100, 0.3), 0px 0px 120px rgba(#3B6350, .9);
    // }

    .border-line {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .content {
        width: 100%;
        padding: 16px;

        .flex-container {
            display: flex;
            align-items: center;
        }

        .image-container {
            // @include flex-center;
            width: 80px;
            height: 80px;
            margin-right: 15px;
            background-image: url(@/assets/svg/moneyAwardImageBackground.svg);
            background-size: cover;
            background-repeat: no-repeat;
            position: relative;
            overflow: hidden;

            @media only screen and (min-width: 1900px) {
                width: 95px;
                height: 95px;
            }

            .image {
                position: absolute;
                width: 100%;
                bottom: 2px;
                left: 0;
                // left: 50%;
                // transform: translateX(-50%);
            }

            .award-subtitle {
                text-align: center;
                @include yellowGradientText;
                font-family: Reaver;
                font-size: 18px;
                position: absolute;
                top: 6px;
                left: 50%;
                transform: translateX(-50%);
                width: 100%;
            }
        }

        .info {

            @media only screen and (max-width: 400px) {
                width: 60%;
            }

            .title {
                flex-grow: 1;
                font-weight: 700;
                display: inline-block;
                margin-bottom: 5px;
            }

            .description {
                font-weight: 500;
            }
        }
    }

// .money-award-content {
//     background-image: url(@/assets/img/moneyAwardBackground.jpg);
//     background-size: cover;
//     background-repeat: no-repeat;
//     position: relative;
//     padding: 16px;
//     overflow: hidden;

//     .info {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         justify-content: center;


//         .title {
//             @include yellowGradientText;
//             font-family: Reaver;
//             font-size: 64px;
//             line-height: .9;
//         }

//         .subtitle {
//             font-family: Reaver;
//             font-size: 40px;
//             // margin-bottom: 3px;
//         }

//         .description {
//             font-weight: 500;
//             margin-bottom: 16px;
//         }

//         .btn {
//             width: 100%;

//             @media only screen and (min-width: 450px) {
//                 width: auto;
//                 padding: 13px 40px;
//             }
//         }
//     }

//     .dollar-sign {
//         position: absolute;
//         bottom: 20px;
//         right: -15px;
//         width: 45px;
//     }
// }
}
</style>