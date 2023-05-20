<template>
    <v-card>
        <v-card-title class="text-center">{{ name }}</v-card-title>
        <v-tabs align-tabs="center" color="primary" v-model="serverTab">
            <v-tab v-for="resourceList, i in Object.keys(resources[name].value)" :value="i" :key="i">{{ resourceList }}
            </v-tab>
        </v-tabs>
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
    </v-card>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { useResourceStore } from '@/stores/resources';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { watch } from 'vue';
var DynamicComponent = defineAsyncComponent(() => import(`./list/${props.name}-card.vue`));
interface Props {
    name: 'networks' | 'volumes' | 'images'
}
const props = defineProps<Props>()
const resourceStore = useResourceStore();
const resources = storeToRefs(resourceStore)
const serverTab = ref(0)

watch(() => props.name, async () => {
    DynamicComponent = defineAsyncComponent(() => import(`./list/${props.name}-card.vue`));
    await resourceStore.fetchResources(props.name)
})

onMounted(async () => {
    await resourceStore.fetchResources(props.name)
})

</script>