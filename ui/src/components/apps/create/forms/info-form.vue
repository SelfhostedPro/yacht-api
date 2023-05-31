<template>
    <v-card flat>
        <v-card-text>
            <v-row>
                <v-col v-if="infoPreview === true">
                    <v-row>
                        <v-col cols="2">
                            <v-avatar size="60" :image="modelValue.info.icon || defaultPreview.icon"></v-avatar>
                        </v-col>
                        <v-col>
                            <v-card-title>{{ modelValue.info.title || defaultPreview.title }}</v-card-title>
                            <v-card-text><vue-markdown
                                    :source="modelValue.info.notes || defaultPreview.notes" /></v-card-text>
                        </v-col>
                    </v-row>
                    <v-card-text class="font-weight-black">DO NOT STORE SENSITIVE INFO HERE OR R/SELFHOSTED WILL JUDGE YOU
                        😤</v-card-text>
                </v-col>
                <v-col v-else>
                    <v-row>
                        <v-col cols="2">
                            <v-avatar size="60"
                                :image="modelValue.info.icon || 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png'"></v-avatar>
                        </v-col>
                        <v-col>
                            <v-text-field label="icon" v-model="modelValue.info.icon"
                                placeholder="https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png" />
                        </v-col>
                    </v-row>
                    <v-text-field label="title" v-model="modelValue.info.title" placeholder="My Container" required />
                    <v-textarea label="notes" auto-grow :placeholder="defaultPreview.notes"
                        v-model="modelValue.info.notes" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
  
<script setup lang="ts">
import VueMarkdown from '@/helpers/render/markdown.vue'
import { Ref, computed, ref } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps(['modelValue', 'servers'])
const emit = defineEmits(['update:modelValue'])
const info = computed({
    get() {
        return props.modelValue
    },
    set(info) {
        emit('update:modelValue', info)
    }
})
const { mdAndDown } = useDisplay()

// Preview Variables
const defaultPreview = {
    icon: 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png',
    title: 'My Container',
    notes: '## Notes\n Some notes about this section: \n\n - *Markdown is supported* \n\n - [links](https://yacht.sh) are super easy to add \n\n - The container will need to be restarted to edit this (limitation of docker)',
}
const infoPreview: Ref<boolean> = ref(false)
</script>
  