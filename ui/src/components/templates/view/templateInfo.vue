<template>
    <v-card>
        <v-card-text>
            <v-img v-if="template['featured_image']" :src="template['featured_image']" />
        </v-card-text>
    </v-card>
</template>
<script setup lang="ts">
import { YachtTemplate } from '@yacht/types'
interface Props {
    template: YachtTemplate["templates"][0]
}
defineProps<Props>()
defineEmits(['close', 'maximize'])
</script>