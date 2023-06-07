<template>
  <v-snackbar v-if="notifications.length > 0" :z-index="5000" :model-value="notifications[notifications.length - 1].visible"
    :color="notifications[notifications.length - 1].color"
    :timeout="notifications[notifications.length - 1].timeout || -1"
    :location="notifications[notifications.length - 1].location"> {{ notifications[notifications.length - 1].content }}
    <template v-slot:actions>
      <v-btn icon variant="text" :color="notifications[notifications.length - 1].btnColor"
        @click="clearSnack(notifications.length - 1)">
        {{ notifications.length > 1 ? `(${notifications.length})` : null }} <v-icon>{{ notifications[notifications.length -
          1].btnIcon }}</v-icon>
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
  notifyStore.listenToNotifications()
})
</script>