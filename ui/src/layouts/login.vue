<template>
    <v-app>
        <v-main>
            <router-view></router-view>
        </v-main>
        <snackbar />
    </v-app>
</template>
  
<script lang="ts" setup>
import Snackbar from '@/components/notifications/snackbar.vue'
</script>