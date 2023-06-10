<template>
    <component :is="!advanced ? VCard : VExpansionPanel" v-bind="componentProps">
        <component :is="!advanced ? VCardText : VExpansionPanelText">
            <v-slide-x-transition group>
                <v-row v-if="Array.isArray(resourceFormat[name])" align="center" no-gutters class="my-2"
                    v-for="_, i of resource" :key="i">
                    <v-col cols="11">
                        <Suspense>
                            <DynamicComponent v-model="resource[i]" :servers="servers" />
                        </Suspense>
                    </v-col>
                    <v-col class="text-center" cols="1">
                        <v-btn icon variant="plain" @click="delRow(i)" class="mx-auto"><v-icon icon="mdi-minus" /></v-btn>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-col cols="12">
                        <Suspense>
                            <DynamicComponent v-model="resource" :servers="servers" />
                        </Suspense>
                    </v-col>
                </v-row>
            </v-slide-x-transition>
            <addbutton v-if="Array.isArray(resourceFormat[name]) && advanced" :name="name" :resources="resource"
                :rounded="'sm'" :icon="false" :size="'large'" @add="addRow()" />
        </component>
        <addbutton v-if="Array.isArray(resourceFormat[name]) && !advanced" :name="name" :resources="resource"
            :rounded="'sm'" :icon="false" :size="'large'" @add="addRow()" />
    </component>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed, WritableComputedRef } from 'vue';
import { VExpansionPanel, VExpansionPanelText } from 'vuetify/components/VExpansionPanel';
import { VCard, VCardText } from 'vuetify/components';
import addbutton from './shared/addButton.vue'
const props = defineProps({
    modelValue: {
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: false
    },
    advanced: {
        type: Boolean,
        default: false,
    },
    servers: {
        required: false
    },
})
const DynamicComponent = defineAsyncComponent(() => import(`./forms/${props.name}-form.vue`));
const emit = defineEmits(['update:modelValue'])

type ResourceFormatType = Record<string, unknown>;
const resourceFormat: ResourceFormatType = {
    base: {
        name: '',
        image: '',
        restart: '',
        server: ''
    },
    info: {
        icon: '',
        title: '',
        notes: '',
    },
    variables: [{ key: '', value: '' }],
    storage: [{ label: '', source: '', destination: '', read_only: false }],
    command: [''],
    sysctls: [{ name: '', value: '' }],
    labels: [{ name: '', value: '' }],
    capabilities: {
        add: [''],
        drop: [''],
    },
    ports: [{ label: '', host: '', container: '', protocol: '' }],
    devices: [{ container: '', host: '', permissions: '' }],
    limits: {
        cpu: '',
        memory: '',
    },
};
const resource: WritableComputedRef<any> = computed({
    get() {
        return props.modelValue;
    },
    set(resource) {
        emit('update:modelValue', resource);
    },
});
const delRow = (idx: number) => {
    if (Array.isArray(resourceFormat[props.name])) {
        resource.value.splice(idx, 1);
    };
}
const addRow = () => {
    if (Array.isArray(resourceFormat[props.name])) {
        resource.value.push(resourceFormat[props.name][0]);
    }
};

const componentProps = computed(() => {
    if (props.advanced) {
        return {
            'bg-color': 'foreground',
            'title': props.name
            // Add the relevant props for v-expansion-panel here
        };
    } else {
        return {
            'variant': 'flat',
            'color': 'foreground',
            'rounded': 0,
            'title': null,
            // Add any other relevant props for v-card here
        };
    }
});

</script>
<style>
.v-expansion-panel-title--active:hover>.v-expansion-panel-title__overlay,
.v-expansion-panel-title[aria-haspopup="menu"][aria-expanded="true"]:hover>.v-expansion-panel-title__overlay {
    opacity: calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier))
}

.v-expansion-panel--active>.v-expansion-panel-title {
    opacity: 1 !important;
}

.v-expansion-panel-title--active>.v-expansion-panel-title__overlay,
.v-expansion-panel-title[aria-haspopup="menu"][aria-expanded="true"]>.v-expansion-panel-title__overlay {
    opacity: 0 !important;
}
</style>