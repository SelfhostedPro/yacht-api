<template>
    <v-card :loading="isLoading.items.has(name)">
        <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" color="primary" height="4" indeterminate></v-progress-linear>
        </template>
        <search-bar :title="name" color="surface" v-model:search="searchQuery" />
        <v-tabs align-tabs="center" color="primary" v-model="serverTab">
            <v-tab v-for="resourceList, i in Object.keys(resources[name].value)" :value="i" :key="i">{{ resourceList }}
            </v-tab>
        </v-tabs>
        <v-fade-transition v-if="isLoading.items.has(name)">
            <v-window>
                <v-row dense>
                    <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-for="i in 12">
                        <v-skeleton-loader class="pa-1 pb-1" type="card" />
                    </v-col>
                </v-row>
            </v-window>
        </v-fade-transition>
        <v-fade-transition v-else-if="resources">
            <v-window v-model="serverTab">
                <v-window-item v-for="(resourceList, server, i) in resources[name].value" :value="i" :key="i">
                    <v-sheet color="foreground">
                        <v-container>
                            <v-row dense>
                                <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-for="resource, i in resourceList"
                                    :key="i">
                                    <DynamicComponent :resource="resource" :server="server" :key="name" />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-sheet>
                </v-window-item>
            </v-window>
        </v-fade-transition>
    </v-card>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { useResourceStore } from '@/stores/resources';
import SearchBar from '../common/SearchBar.vue';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { watch } from 'vue';
import { useLoadingStore } from '@/stores/loading';
var DynamicComponent = defineAsyncComponent(() => import(`./list/${props.name}-card.vue`));
interface Props {
    name: 'networks' | 'volumes' | 'images'
}
const props = defineProps<Props>()
const loadingStore = useLoadingStore()
const resourceStore = useResourceStore();
const { isLoading } = storeToRefs(loadingStore)
const resources = storeToRefs(resourceStore)
const serverTab = ref(0)
const searchQuery = ref('')

watch(() => props.name, async () => {
    DynamicComponent = defineAsyncComponent(() => import(`./list/${props.name}-card.vue`));
    await resourceStore.fetchResources(props.name)
})

onMounted(async () => {
    await resourceStore.fetchResources(props.name)
})

</script>