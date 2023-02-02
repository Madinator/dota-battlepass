<script setup lang="ts">
import Dot from '@/components/dot.vue';

const props = defineProps({
    username: String,
});

</script>

<template>
 <div class="isActive">
    <Dot class="isActive__dot" :name="props.username"/>
    <span class="isActive__text">Не подключен</span>
</div>
</template>

<style lang="scss" scoped>
.isActive {
    display: flex;
    align-items: center;
    &__text {
        margin-left: 4px;
        font-family: 'Gilroy';
        font-style: normal;
        font-weight: 500;
        font-size: 10px;
        line-height: 16px;
    }
}
</style>
