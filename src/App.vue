<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useLevelsStore } from '@/stores/levels';
import { useEventsStore } from '@/stores/events';
import AppNav from '@/components/Reusable/App/Nav.vue';
import PreviewScreen from '@/components/Singular/Game/PreviewScreen.vue';
import { useRouletteStore } from '@/stores/roulette';
import { authBetBoom } from './services/http/http.helper';

// IF TOUCHPAD DEVICE'S HEIGHT CHANGES - CHANGE BASE 100VH HEIGHT
const appHeight = (): void => {
    const doc = document.documentElement;
    if (window.outerWidth < 1000) {
        doc.style.setProperty('--app-height', `${window.innerHeight * 1.05}px`);
    } else {
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    }
};

// ON WINDOW RESIZE
const onResize = (): void => {
  appHeight();
};

const baseStore = useBaseStore();
const { 
  isAwardsWindowOpened, allLevelsFinishedIndicator, endLightLineIndicator, myCharacterAction,
   creepAnimationIndicator, isRouletteWindowOpened, goToNextEvent, currentUserAction, updateProgressBarPositionIndicator
   } = storeToRefs(baseStore);


// const userStore = useUserStore();
// const { user } = storeToRefs(userStore);

const eventsStore = useEventsStore();
const { fightEvents, prizesForLevels, allPrizes } = storeToRefs(eventsStore);

const levelsStore = useLevelsStore();
const { levels } = storeToRefs(levelsStore);

const rouletteStore = useRouletteStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

let isLastLevelIndicator = ref<boolean>(false);

watchEffect(() => {
  console.log('allPrizes', allPrizes.value);
})

// {id: '74eabc61-8cc2-4c9e-8f75-dd8486bf4fd5', levelId: 0, points: 0, description: ''}
// {id: '8aad640e-50ad-4527-9047-7de708ac0455', levelId: 1, points: 100, description: ''}
// {id: '2e33511d-b067-4097-96ae-5e37b7ae8368', levelId: 2, points: 400, description: ''}
// {id: '6abdc12a-b0fc-490f-bd01-d84a49ce9560', levelId: 3, points: 550, description: ''}
// {id: '8f11f029-6c71-4779-8ef3-7e00b732b029', levelId: 4, points: 1100, description: ''}
// {id: 'f68a902d-dfe4-4c15-8955-bbd5045c8123', levelId: 5, points: 1300, description: ''}
// {id: '5006dfcd-a2ce-44e6-b071-851066284b44', levelId: 6, points: 1800, description: ''}
// {id: '74de6b42-9119-4082-aeb2-b7fff016e530', levelId: 7, points: 2800, description: ''}
// {id: 'eabb9823-a319-489b-a5a8-fda5f5be4947', levelId: 8, points: 4200, description: ''}
// {id: '5b3d5406-8768-42d2-8d60-f2e94cd56cd0', levelId: 9, points: 5200, description: ''}
// {id: '9ffe31c9-4e07-41bf-a289-570fd4134ffc', levelId: 10, points: 6500, description: ''}
// {id: 'f656eb8a-ee97-47df-b293-b33a765f05cf', levelId: 11, points: 7300, description: ''}
// {id: '3a8a92ea-01ea-459c-a7c0-7643d176dc0b', levelId: 12, points: 8500, description: ''}
// {id: '460ae391-f016-41b2-89ca-cbd44e8c0769', levelId: 13, points: 9300, description: ''}

// watchEffect(() => {
//   if (user.value) {
//     console.log('User value', user.value)
//   }
// })

watchEffect(() => {
  if (levels.value.length < 1 || isRegistered.value) return;
  const currentLevel = levels.value.find((el, i, arr) => {

      if (i + 1 === arr.length) {
        isLastLevelIndicator.value = true;
        return el.points;
      }
      if (el.points === 0 && user.value.points < arr[i + 1].points) {
        return el;
      }
      return user.value.points - arr[i + 1].points < 0
  })

  // if (isLastLevelIndicator.value && user.value.points >= currentLevel!.points) {
  //   allLevelsFinishedIndicator.value = true;
  // }

  if (currentLevel || currentLevel === 0) {
    user.value.level = currentLevel.levelId;
  } else {
    user.value.level = 1;
  }
});

watchEffect(() => {
  if (isRegistered.value) {
    // levelsStore.setLevels(true);
    levelsStore.getLevels();
    eventsStore.setEvents(true);
    // console.log(levels.value)
  } else  {
    // levelsStore.setLevels(false);
    levelsStore.setStaticLevels();
    // levelsStore.getLevels();
    eventsStore.setEvents(false);
  }
});

watchEffect(() => {
  if (!endLightLineIndicator.value || !isRegistered.value) return;
  user.value.points = 0;
  user.value.level = 1;
  setTimeout(() => {
    allLevelsFinishedIndicator.value = false;
    isLastLevelIndicator.value = false;
  }, 1000);
});

// rouletteStore.getRoullettes();
// watch(isRouletteWindowOpened, (newValue) => {
//   if(newValue) {
//     rouletteStore.getRoullettes();
//   }
// })

// watchEffect(() => {
//   if (user.value.id)
// })

const html = ref<null | HTMLElement>(null)

const route = useRoute();

watch(route, () => {
  if (route.name !== 'game') {
    isAwardsWindowOpened.value = false;
    document.body.classList.remove('body-grab');
    document.body.classList.remove('body-grabbing');
    document.body.classList.remove('body-game');
    myCharacterAction.value = 'idle';
    creepAnimationIndicator.value = false;
    if (html.value) {
      html.value.classList.remove('body-game');
    }

    // if (user.value.points >= levels.value[levels.value.length - 1].points) return;
    const currentEvent = fightEvents.value.find(el => {
        return el.userLevel === user.value.level;
    });
    if (!currentEvent) return;
    myCharacterAction.value = 'idle';
    goToNextEvent.value = true;
    currentUserAction.value = currentEvent.userActionType;
    updateProgressBarPositionIndicator.value = true;
  } else {
    document.body.classList.add('body-grab');
    document.body.classList.add('body-game');

    if (html.value) {
      html.value.classList.add('body-game');
    }
  }
})

// watch(isRegistered, (newValue) => {
//     // if (newValue) {
//         console.log('IsRegistered', newValue)
//     // }
// })

// watch(user, (newValue) => {
//     // if (newValue) {
//         console.log('IsRegistered', user.value)
//     // }
// })

watchEffect(() => {
  if (!isRegistered.value && user.value.id) {
    user.value = {
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
    }
  }
  
  // if (!isRegistered.value)
})

onMounted(() => {
  html.value = document.querySelector('html');
  appHeight();
  authBetBoom();
  // userStore.getUser();
  // userStore.getUserInfo();
  // rouletteStore.getRoullettes();
  // eventsStore.getPrizesForLevels();

  if (!isRegistered.value) {
    allLevelsFinishedIndicator.value = false;
  }

  // console.log('IsRegistered', isRegistered.value);
  // console.log('user', user.value);
  // console.log('allLevelsFinishedIndicator', allLevelsFinishedIndicator.value);

  // setInterval(() => {
  //   userStore.getUserInfo();
  // }, 1000)
  
  // ADD WINDOW EVENT LISTENER
  window.addEventListener('resize', onResize);

  let googleLetManagerScript = document.createElement('script');
  googleLetManagerScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-3FGF7CGPH2');
  googleLetManagerScript.async = true;

  let gtagScript = document.createElement('script');
  gtagScript.innerHTML = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-3FGF7CGPH2');";
  document.head.appendChild(googleLetManagerScript);
  document.head.appendChild(gtagScript);

})

onUnmounted(() => {
  // REMOVE WINDOW EVENT LISTENER
  window.removeEventListener('resize', onResize);
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <Transition>
      <component :is="Component" />
    </Transition>
  </router-view>
  <PreviewScreen />
  <AppNav />
</template>

<style lang="scss">
.desktop {
  @media only screen and (max-width: 850px) {
    display: none !important;
  }
}

.mobile {
  @media only screen and (min-width: 850px) {
    display: none !important;
  }
}

.closed {
  opacity: 0;
  visibility: hidden;
}

.blured {
  filter: blur(10px);
}

// .body-account {
//   transform: matrix(-1, 0, 0, 1, 0, 0);
// }

.body-game {
  overflow-y: hidden;
  height: 100vh;
}

.body-grab {
  -moz-user-select: none !important;
  -webkit-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;

  .main-map {
    cursor: grab;
  }
}

.body-grabbing {
  -moz-user-select: none !important;
  -webkit-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;

  .main-map {
    cursor: grabbing;
  }
}

canvas {
  position: absolute;
  bottom: 0;
}

.btn {
  font-family: Reaver;
  text-align: center;
  padding: 1.2rem 0;
  text-shadow: 0px 2px 4px rgba(6, 13, 46, 0.5);
  background-size: cover;
  transition: all .2s;

  &:hover {
    transform: scale(1.01);
  }
}

.btn-red {
  background-image: url(@/assets/svg/redButton.svg);
}

.btn-yellow {
  background-image: url(@/assets/svg/yellowButton.svg);
}

.btn-green {
  background-image: url(@/assets/svg/greenButton.svg);
}

.btn-transparent {
  @include greenGradientText;
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
