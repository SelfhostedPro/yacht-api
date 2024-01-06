<template>
  <v-card color="foreground" :rounded="0">
      <v-card-text>

      </v-card-text>
      <p>{{ users }}</p>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia';
const settingStore = useSettingsStore()
const { users } = storeToRefs(settingStore)



onMounted(async () => {
  settingStore.fetchUsers()
})
</script>
