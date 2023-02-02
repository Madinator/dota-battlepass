<script setup lang="ts">
import { computed, reactive } from '@vue/reactivity';
import { onMounted } from 'vue';

const props = defineProps({
    username: String,
});

const colors = reactive({
    color1: '#FD3A3A',
    color2: '#A61930',
})

onMounted(() => {
    if(props.username) {
        colors.color1 = 'green';
        colors.color2 = 'green';
    }
})
</script>

<template>
    <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="2" cy="2" r="2" fill="url(#paint0_linear_704_13497)"/>
        <defs>
            <linearGradient id="paint0_linear_704_13497" x1="2" y1="0" x2="2" y2="4" gradientUnits="userSpaceOnUse">
                <stop :stop-color="colors.color1"/>
                <stop offset="1" :stop-color="colors.color2"/>
            </linearGradient>
        </defs>
    </svg>

</template>

<style lang="scss" scoped>

</style>
