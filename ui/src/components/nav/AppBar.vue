<template>
  <v-app-bar color="rgba(65, 184, 131, 0.9)" elevation="8">
    <v-app-bar-title>
      <v-img max-height="32" :src="logo" />
    </v-app-bar-title>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { Logo } from "@/composables/logo"

const logo = Logo()
</script>
