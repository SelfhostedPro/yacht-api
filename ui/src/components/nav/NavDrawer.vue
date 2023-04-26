<template>
    <v-navigation-drawer app v-model="drawer" location="bottom" temporary>
        <v-list :items="links"></v-list>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
defineProps(['links'])
const drawer: Ref = ref(false)

defineExpose({
    drawer
})
</script>