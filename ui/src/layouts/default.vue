<template>
  <v-app>
    <sidebar :links="links" />
    <app-bar :links="links" />
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
      <snackbar />
    </v-main>
    <!-- <nav-drawer ref="drawer" :links="links" /> -->
  </v-app>
</template>
  
<script lang="ts" setup>
import AppBar from '@/components/nav/AppBar.vue'
import Sidebar from '@/components/nav/Sidebar.vue'
// import NavDrawer from '@/components/nav/NavDrawer.vue'
import Snackbar from '@/components/notifications/snackbar.vue'
// const drawer: Ref = ref(false)
const links = [
  {
    to: "/",
    icon: "mdi-view-dashboard",
    text: "Dashboard",
    divider: true
  },
  {
    text: "Applications",
    to: "/apps",
    icon: "mdi-application"
  },
  {
    text: "Templates",
    to: "/templates",
    icon: "mdi-folder"
  },
  {
    text: "Projects",
    to: "/projects",
    icon: "mdi-book-open"
  },
  {
    icon: "mdi-cube-outline",
    text: "Resources",
    subLinks: [
      {
        text: "Images",
        to: "/resources/images",
        icon: "mdi-disc"
      },
      {
        text: "Volumes",
        to: "/resources/volumes",
        icon: "mdi-database"
      },
      {
        text: "Networks",
        to: "/resources/networks",
        icon: "mdi-network"
      }
    ]
  },
  {
    to: "/settings",
    icon: "mdi-cog",
    text: "Settings"
  }
]
</script>
  