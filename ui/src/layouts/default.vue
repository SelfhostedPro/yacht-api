<template>
    <v-app>
      <default-bar />
      <sidebar />
      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script lang="ts" setup>
    import DefaultBar from '@/components/nav/AppBar.vue'
    import Sidebar from '@/components/nav/Sidebar.vue'
  </script>
  