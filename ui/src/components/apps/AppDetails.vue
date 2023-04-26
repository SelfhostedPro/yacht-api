<template>
    <v-card color="background" roudned="false" :loading="isLoading.get('fetchAppDetails')">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <v-row v-if="appDetails" no-gutters>
            <v-col sm="12" md="6">
                <Suspense>
                    <namecard class="my-2 mx-1" :app="appDetails" :ociInfo="ociInfo" />
                </Suspense>
                <Suspense>
                    <actioncard class="my-2 mx-1" :app="appDetails" />
                </Suspense>
                <Suspense>
                    <environmentcard class="my-2 mx-1" :app="appDetails" />
                </Suspense>
            </v-col>
            <v-col sm="12" md="6">
                <Suspense>
                    <networkcard class="my-2 mx-1" :app="appDetails" />
                </Suspense>
                <Suspense>
                    <storagecard class="my-2 mx-1" :app="appDetails" />
                </Suspense>
            </v-col>
            <v-col>
                <pre>{{ JSON.stringify(appDetails, null, 2) }}</pre>

            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import namecard from './details/namecard.vue';
import actioncard from './details/actioncard.vue';
import networkcard from './details/networkcard.vue';
import storagecard from './details/storagecard.vue';
import environmentcard from './details/environmentcard.vue';

import { useAppStore } from '@/stores/apps'
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
const props = defineProps(['name'])

// Store variables
const appStore = useAppStore()
const { appDetails, isLoading } = storeToRefs(appStore)
const ociInfo = ref({})

// Fetch App Details
onMounted(async () => {
    appStore.fetchAppDetails(props.name)
        .then(() => {
            ociInfo.value = {
                title: appDetails.value.Config.Labels['org.opencontainers.image.title'] || appDetails.value.ShortName,
                description: appDetails.value.Config.Labels['org.opencontainers.image.description'] || null,
                docs: appDetails.value.Config.Labels['org.opencontainers.image.documentation'] || null,
                url: appDetails.value.Config.Labels['org.opencontainers.image.url'] || appDetails.value.Config.Labels['com.docker.extension.publisher-url'] || null,
                source: appDetails.value.Config.Labels['org.opencontainers.image.source'] || null,
                vendor: appDetails.value.Config.Labels['org.opencontainers.image.vendor']
            }
        })
})
</script>