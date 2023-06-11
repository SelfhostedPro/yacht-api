<template>
    <v-card class="overflow-auto">
        <v-sheet color="foreground">
            <v-container>
                <v-row dense>
                    <v-col>
                        <v-fade-transition>
                            <v-carousel v-if="searchQuery.length < 1 && template.featured" cycle show-arrows="hover"
                                height="400" hide-delimiters progress="primary">
                                <v-carousel-item v-for="app in template.featured" :key="template.templates[app].title">
                                    <v-card class="text-center fill-height">
                                        <v-img height="100%" class="d-flex align-end featured-image"
                                            :src="template.templates[app]['featured_image'] ? template.templates[app]['featured_image'] : template.templates[app].logo"
                                            cover>
                                            <v-card :rounded="0" class="featured-card" flat>
                                                <v-card-title class="text-high-emphasis">{{ template.templates[app].title ||
                                                    template.templates[app].name
                                                }}</v-card-title>
                                                <v-card-text style="max-height: 60px;"
                                                    class="text-high-emphasis overflow-auto mb-2"
                                                    v-if="template.templates[app].description">{{
                                                        template.templates[app].description }}</v-card-text>
                                                <v-card-actions>
                                                    <v-btn @click="selectedApp = template.templates[app]; openDialog = true"
                                                        icon> <v-icon icon="mdi-plus" /> </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-img>
                                    </v-card>
                                </v-carousel-item>
                            </v-carousel>
                        </v-fade-transition>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col class="text-center">
                        <v-fade-transition>
                            <v-card v-if="searchQuery.length < 1">
                                <v-card-title>{{ template.title }}</v-card-title>
                                <v-card-text v-if="template.description" class="text-high-emphasis px-12"
                                    style="white-space: pre-wrap;">{{ template.description }}</v-card-text>
                                <v-card-subtitle>name: {{ template.name }}</v-card-subtitle>
                                <v-card-subtitle>type: {{ template.type }}</v-card-subtitle>
                                <v-card-subtitle>created: {{ formatDate(template.created) }}</v-card-subtitle>
                                <v-card-subtitle>apps: {{ template.templates.length }}</v-card-subtitle>
                                <v-card-actions class="flex-d justify-center">
                                    <v-btn v-for="link in template['links']" :color="link.color || null" :key="link.text"
                                        :prepend-icon="link.icon || 'mdi-link'" :href="link.url || null" target="_blank">{{
                                            link.text || 'link' }}</v-btn>
                                    <v-menu v-model="deleteMenu" :close-on-content-click="false" location="top"
                                        transition="slide-y-transition">
                                        <template v-slot:activator="{ props }">
                                            <v-btn v-bind="props" color="error" prepend-icon="mdi-delete">delete</v-btn>
                                        </template>
                                        <v-card :title="`delete template ${template.name}?`" max-width="30vw">
                                            <v-card-text>
                                                This action cannot be undone. <br />
                                                Apps deployed with this template will continue to run on your system.<br />
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-btn @click="deleteTemplate(); deleteMenu = false" color="error">confirm</v-btn>
                                                <v-btn @click="deleteMenu = false" >cancel</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-menu>
                                </v-card-actions>
                            </v-card>
                        </v-fade-transition>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12" xs="12" sm="6" md="4" lg="4" xl="3" v-for="app in templates" :key="app.title">
                        <v-card class="overflow-auto" min-height="200" max-height="200">
                            <v-card-item :prepend-avatar="app.logo">
                                <v-card-title>{{ app.title || app.name }}
                                    <v-btn class="float-right" variant="plain" @click="selectedApp = app; openDialog = true"
                                        icon> <v-icon icon="mdi-plus" />
                                    </v-btn>
                                    <v-btn class="float-right" variant="plain" @click="selectedApp = app; openInfo = true"
                                        icon><v-icon icon="mdi-information-outline" />
                                    </v-btn>
                                </v-card-title>
                                <v-card-subtitle class="text-primary" color="primary">{{ app.image }}</v-card-subtitle>
                            </v-card-item>
                            <v-card-text>{{ app.description || `${app.title || app.name} doesn't provide a
                                description.`}}</v-card-text>
                            <v-card-actions>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-dialog v-model="openDialog" persistent :fullscreen="maximize" :max-width="maximize ? undefined : '1000'"
                transition="dialog-bottom-transition">
                <template v-slot:default>
                    <app-create :template="selectedApp" @maximize="maximize = !maximize" :maximize="maximize"
                        @close="openDialog = false; selectedApp = null" />
                </template>
            </v-dialog>
            <v-dialog v-model="openInfo" :max-width="maximize ? undefined : '800'" :fullscreen="maximize"
                transition="dialog-bottom-transition">
                <template v-slot:default>
                    <v-card color="background" class="overflow-auto">
                        <title-bar :title="`${selectedApp.title || selectedApp.name} info`" color="primary"
                            @maximize="maximize = !maximize" :closable="true"
                            @close="openInfo = false; selectedApp = null" />
                        <v-card-text>
                            <template-info :template="selectedApp" />
                        </v-card-text>
                    </v-card>
                </template>
            </v-dialog>
            <pre>{{ template }}</pre>
        </v-sheet>
    </v-card>
</template>

<script setup lang="ts">
import { YachtTemplate } from '@yacht/types'
import { parseISO } from 'date-fns';
import TitleBar from '@/components/common/TitleBar.vue';
import AppCreate from '@/components/apps/AppCreate.vue';
import TemplateInfo from '@/components/templates/view/templateInfo.vue';
import { ref } from 'vue';
import { Ref } from 'vue';
import { useTemplateStore } from '@/stores/templates';
interface Props {
    template: YachtTemplate,
    templates: YachtTemplate['templates']
    searchQuery: string,
}
const deleteMenu = ref(false)
const maximize = ref(false)
const selectedApp: Ref<YachtTemplate['templates'][0]> = ref(null)
const openDialog: Ref<boolean> = ref(false)
const openInfo: Ref<boolean> = ref(false)
const props = defineProps<Props>()
defineEmits(['close', 'maximize'])

const deleteTemplate = async () => {
    const templateStore = useTemplateStore()
    await templateStore.deleteTemplate(props.template.name)
}

const formatDate = (date) => {
    return parseISO(date).toLocaleString()
}
</script>

<style>
.featured-card {
    background: linear-gradient(0deg, rgba(33, 33, 33, 0.8) 0%, rgba(33, 33, 33, 0.9) 10%, rgba(33, 33, 33, 0.9) 90%, rgba(33, 33, 33, 0.8) 100%);
    backdrop-filter: blur(5px) brightness(40%);
}
</style>