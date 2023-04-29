<template>
    <v-card color="background" roudned="false">
        <v-row v-if="app && app.name" no-gutters>
            <v-col sm="12" md="6">
                <Suspense>
                    <namecard @refresh="handleRefresh" class="mb-1" :app="app" />
                </Suspense>
                <Suspense>
                    <actioncard @action="handleAction" class="mb-1" :app="app" />
                </Suspense>
                <Suspense v-show="mdAndUp">
                    <environmentcard class="mb-1" v-show="mdAndUp" :app="app" />
                </Suspense>
            </v-col>
            <v-col sm="12" md="6">
                <Suspense>
                    <networkcard :class="mdAndUp ? 'mb-1 ml-1' : 'mb-1'" :app="app" />
                </Suspense>
                <Suspense>
                    <storagecard :class="mdAndUp ? 'mb-1 ml-1' : 'mb-1'" :app="app" />
                </Suspense>
                <Suspense>
                    <environmentcard :class="mdAndUp ? 'mb-1 ml-1' : 'mb-1'" v-show="!mdAndUp" :app="app" />
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
import { Container } from '@/types/apps';

// Props
const props = defineProps(['name'])
// Display Breakpoints
const { mdAndUp } = useDisplay()

// Store variables
const appStore = useAppStore()
const { apps } = storeToRefs(appStore)
const app: Ref<Container> = ref({} as Container)

if (apps.value.length > 0) {
    app.value = appStore.getApp(props.name)
}

// Fetch App Details
onMounted(async () => {
    await appStore.fetchApp(props.name)
    app.value = appStore.getApp(props.name)
})

const handleRefresh = async () => {
    await appStore.fetchApp(props.name)
    app.value = appStore.getApp(props.name)
}

// Action button functions
const handleAction = async (action: string) => {
    await appStore.fetchAppAction(app.value.id, action)
    app.value = appStore.getApp(props.name)
}
</script>