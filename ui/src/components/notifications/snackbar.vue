<template>
  <v-snackbar :z-index="5000" v-for="notification, i in notifications" :model-value="notification.visible"
    :color="notification.color" :timeout="notification.timeout || -1" :location="notification.location">
    {{ notification.content }}
    <template v-slot:actions>
      <v-btn icon variant="text" :color="notification.btnColor" @click="clearSnack(i)">
        ({{ notifications.length }}) <v-icon>{{ notification.btnIcon }}</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
  
<script setup lang="ts">
import { useNotifyStore } from '@/stores/notifications';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount } from 'vue';
import { onMounted } from 'vue';


// Store variables
const notifyStore = useNotifyStore()
const { notifications } = storeToRefs(notifyStore)


// Used to prevent snackbar style from being reset before it closes fully
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const clearSnack = (async (idx: number) => {
  notifications.value[idx].visible = false
  await sleep(100)
  notifyStore.clearNotification(idx)
})
onBeforeUnmount(async () => {
  await notifyStore.close()
})
onMounted(async () => {
  await notifyStore.listenToNotifications()
})
</script>