<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';

import TileAnimation from '@/assets/js/tile-animation';

const props = defineProps(['position', 'userId', 'index']);

const baseStore = useBaseStore();
const { isAwardsWindowOpened, isRouletteWindowOpened } = storeToRefs(baseStore);

const importAll = (r) => {
  const arr = [];
  for (const key in r) {
      arr.push(key);
  }
  return arr;
}
const idleFrames = importAll(import.meta.glob("@/assets/sprites/Runes/Idle/*"));
// const idleFrames = ref(null)
const _idleAnimation = ref(null);

const animationState = ref({
    state: 'stopped'
});
const queue = ref([]);
const canvas = ref(null);
let _currentAnimation = ref(null);
let _paused = ref(false);

const basePosition = ref(0);
const mapWidth = ref(0);

const play = (name, infinite = false) => {
  if (_paused.value || !idleFrames) return;
  queue.value.push({
    name,
    infinite,
  });
};

const stop = () => {
  if (_currentAnimation.value) {
    _currentAnimation.value.stopAnimation();
  }
};

const playNext = (name, infinite) => {  
  switch (name) {
    case "idle":
      _idleAnimation.value?.play(2100, infinite);
      return _idleAnimation.value;
    default:
      console.error("Unexpected animation name")
  }
};

const checkAnimationVisibility = () => {
  let widthIndex = 1.8;
  let widthIndex2 = 1.5;
  let widthIndex3 = 1.8;
  if (window.outerWidth < 1600 && window.outerWidth > 1300) {
    widthIndex2 = 1.8;
  }

  if (window.outerWidth >= 1600) {
    widthIndex2 = 1.8;
  }

  if (window.outerWidth < 600) {
    widthIndex = .2;
    widthIndex3 = .8;
    widthIndex2 = 2.3;
  }

  if (animationState.value.state === "stopped" && document.body.scrollLeft - basePosition.value < window.outerWidth / widthIndex3 &&
    basePosition.value - document.body.scrollLeft < window.outerWidth * widthIndex2) {
    // console.log('IN RANGE' + props.index);
    play('idle', true);
    return;
  }

  if (animationState.value.state === "playing" && (document.body.scrollLeft - basePosition.value >= window.outerWidth / widthIndex ||
  basePosition.value - document.body.scrollLeft >= window.outerWidth * widthIndex2)) {
    if (isAwardsWindowOpened.value || isRouletteWindowOpened.value) {
      stop();
      return;
    }
    // console.log('OUT RANGE');
    stop();
    return;
  }
};

const calcPositions = () => {
  if (!props.userId) {
      mapWidth.value = 4 * window.outerHeight;
    if (window.outerHeight < 550) {
      mapWidth.value = 2200;
    }

    basePosition.value = Math.floor(((props.position) / 100) * mapWidth.value + window.outerWidth * .5);
  } else {
      mapWidth.value = 4 * 4 * window.outerHeight;
      if (window.outerHeight < 550) {
        mapWidth.value = 4 * 2200;
      }

      let positionIndex = 4;
      if (window.outerWidth < 600) {
        positionIndex = 5;
      }

      basePosition.value = Math.floor((Math.abs(props.position + positionIndex) / 100) * mapWidth.value);
      // basePosition.value = Math.floor((Math.abs(props.position + 5) / 100) * mapWidth.value);
      // if (props.index === 6) {
      //   if (window.outerWidth < 1100) {
      //     basePosition.value = Math.floor((Math.abs(props.position + 8) / 100) * mapWidth.value);
      //   } else {
      //     basePosition.value = Math.floor((Math.abs(props.position - 1) / 100) * mapWidth.value);
      //   }
      // }
      // if (props.index === 10) {
      //   if (window.outerWidth < 1100) {
      //     basePosition.value = Math.floor((Math.abs(props.position + 11) / 100) * mapWidth.value);
      //   } else {
      //     basePosition.value = Math.floor((Math.abs(props.position - 3) / 100) * mapWidth.value);
      //   }
      // }
  }
}

watchEffect(() => {
  // if (isAwardsWindowOpened.value || isRouletteWindowOpened.value) {
  //   stop();
  // } else {
    checkAnimationVisibility();
  // }
});

watchEffect(() => {
  if (!props.userId) {
    calcPositions();
  } else {
    calcPositions();
  }
})

// watchEffect(() => {
//   if (idleFrames.value) {
//     console.log(idleFrames.value)
//     _idleAnimation.value = new TileAnimation(canvas.value, 1200, 1200, idleFrames.value);

//     _idleAnimation.value.setQueue(queue.value).setState(animationState);
//     play('idle', true);
//   }
// })

onMounted(() => {
  // setTimeout(() => {
  //   idleFrames.value = importAll(import.meta.glob("/src/assets/sprites/Runes/Idle/*"));
  // }, 2000);
    _idleAnimation.value = new TileAnimation(canvas.value, 1200, 1200, idleFrames);

    _idleAnimation.value.setQueue(queue.value).setState(animationState);
  
  // play('idle', true);
  calcPositions();
  checkAnimationVisibility();

  document.body.addEventListener('scroll', () => {
    checkAnimationVisibility();
  })

  // let width = window.outerWidth;
  // if (window.outerWidth < 700) {
  //   width = 700;
  // }

  // document.body.addEventListener('scroll', () => {
  //   // console.log(document.body.scrollLeft, basePosition.value)
  //   if (animationState.value.state === "playing" || isAwardsWindowOpened.value || isRouletteWindowOpened.value) {
  //     if (Math.abs(document.body.scrollLeft - (basePosition.value)) >= width && !props.userId) {
  //       // console.log('STOPPED Rune', basePosition.value);
  //       stop();
  //     }
  //     if (props.userId) {
  //       if (props.index === 1 && (document.body.scrollLeft >= basePosition.value || basePosition.value - document.body.scrollLeft >= width)) {
  //         // console.log('STOPPED Rune', basePosition.value);
  //         stop();
  //       }
        
  //       if (props.index > 1 && (document.body.scrollLeft >= basePosition.value || basePosition.value - document.body.scrollLeft >= width)) {
  //         // console.log('STOPPED Rune', basePosition.value);
  //         stop();
  //       }
  //     }
  //     return;
  //   }
  //   if (animationState.value.state === "stopped" &&
  //   !isAwardsWindowOpened.value && !isRouletteWindowOpened.value) {
  //     if (Math.abs(document.body.scrollLeft - (basePosition.value)) < width && !props.userId) {
  //       // console.log('STARTED Rune', basePosition.value);
  //       play('idle', true);
  //     }
  //     if (props.userId && (document.body.scrollLeft < basePosition.value && basePosition.value - document.body.scrollLeft < width * 1.4 )) {
  //         if (props.index === 1) {

  //         }
  //         // console.log('STARTED Rune', basePosition.value);
  //         play('idle', true);
  //     }
  //   }
  // })

  // document.body.addEventListener('scroll', () => {
  //   console.log(Math.floor(Math.abs(document.body.scrollLeft - (basePosition.value - window.outerWidth))), basePosition.value)
  //   if (Math.floor(document.body.scrollLeft - (basePosition.value - window.outerWidth)) >= window.outerWidth / 2 && animationState.value.state === "playing" ||
  //   isAwardsWindowOpened.value || isRouletteWindowOpened.value) {
  //     console.log('STOPPED Rune', (basePosition.value - window.outerWidth));
  //     stop();
  //     return;
  //   }
  //   if (Math.abs(document.body.scrollLeft - (basePosition.value - window.outerWidth)) < window.outerWidth / 2 && animationState.value.state === "stopped" &&
  //   !isAwardsWindowOpened.value && !isRouletteWindowOpened.value) {
  //     console.log('STARTED Rune', (basePosition.value - window.outerWidth));
  //     play('idle', true);
  //   }
  // })


  const handleQueue = () => {
    if (animationState.value.state === "stopped" && queue.value.length) {
      animationState.value.state = "playing";
      const animation = queue.value.shift();
      _currentAnimation.value = playNext(animation.name, animation.infinite);
    }
    requestAnimationFrame(handleQueue)
  }
  requestAnimationFrame(handleQueue);
})
</script>

<template>
  <!-- <div class="sprite-container"> -->
    <canvas ref="canvas" class="main-frame"></canvas>
  <!-- </div> -->
</template>

<style lang="scss" scoped>
.main-frame {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10000;
  // transform: scale(1.1);
}
</style>