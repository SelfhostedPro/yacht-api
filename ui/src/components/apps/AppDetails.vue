<template>
    <v-card color="background" roudned="false">
        <v-row v-if="app && app.name" dense>
            <v-col cols="12">
                <Suspense>
                    <namecard @refresh="handleRefresh" @action="handleAction" :app="app" />
                </Suspense>
            </v-col>
            <v-col :cols="mdAndDown ? 12 : 6">
                <Suspense>
                    <networkcard :app="app" />
                </Suspense>
            </v-col>
            <v-col :cols="mdAndDown ? 12 : 6">
                <Suspense>
                    <storagecard :app="app" />
                </Suspense>
            </v-col>
            <v-col :cols="mdAndDown ? 12 : 6">
                <Suspense>
                    <environmentcard :app="app" />
                </Suspense>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import namecard from '@/components/apps/details/namecard.vue';
import actioncard from '@/components/apps/details/actioncard.vue';
import networkcard from '@/components/apps/details/networkcard.vue';
import storagecard from '@/components/apps/details/storagecard.vue';
import environmentcard from '@/components/apps/details/environmentcard.vue';
import { useDisplay } from 'vuetify';
import { useAppStore } from '@/stores/apps'
import { storeToRefs } from 'pinia';
import { Ref, onMounted, ref } from 'vue';
import { Container } from '@yacht/types';

// Props
const props = defineProps(['server', 'name'])
// Display Breakpoints
const { mdAndDown } = useDisplay()

// Store variables
const appStore = useAppStore()
const { apps } = storeToRefs(appStore)
const app: Ref<Container> = ref({} as Container)

if (Object.keys(apps.value).length > 0) {
    app.value = appStore.getApp(props.server, props.name)
}

// Fetch App Details
onMounted(async () => {
    await appStore.fetchApp(props.server, props.name)
    app.value = appStore.getApp(props.server, props.name)
})

const handleRefresh = async () => {
    await appStore.fetchApp(props.server, props.name)
    app.value = appStore.getApp(props.server, props.name)
}

// Action button functions
const handleAction = async (action: string) => {
    await appStore.fetchAppAction(props.server, app.value.id, action)
    app.value = appStore.getApp(props.server, props.name)
}
</script>