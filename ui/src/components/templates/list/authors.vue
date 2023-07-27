<template>
    <v-tooltip v-for="author in authors" :key="author.name" :text="author.name" location="top">
        <template v-slot:activator="{ props }">
            <a v-if="author.url" :href="author.url" target="_blank">
                <v-avatar size="32" v-bind="props">
                    <v-img v-if="author.avatar" :src="author.avatar" />
                    <v-img v-else :src="`https://avatars.dicebear.com/api/initials/${author.name}.svg`" />
                </v-avatar>
            </a>
            <v-avatar v-else size="32" v-bind="props">
                <v-img v-if="author.avatar" :src="author.avatar" />
                <v-img v-else :src="`https://avatars.dicebear.com/api/initials/${author.name}.svg`" />
            </v-avatar>
        </template>
    </v-tooltip>
</template>
<script setup lang="ts">
import { YachtTemplateAuthor } from '@yacht/types';
interface Props {
    authors: YachtTemplateAuthor[]
}
defineProps<Props>()
</script>
