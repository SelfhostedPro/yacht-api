<template>
    <v-card max-height="600" id="images-card" class="pa-1 pb-1 overflow-auto" density="compact">
        <v-card-item :prepend-avatar="imageIcon(resource['Labels'])">
            <v-card-title> {{ imageTitle().toLowerCase() }}</v-card-title>
            <v-card-subtitle>{{ resource.RepoTags[0] }}</v-card-subtitle>
            <v-card-subtitle>size: {{ imageSize().toFixed(2) + ' MB' }}</v-card-subtitle>
            <v-card-subtitle>created: {{ formatDates(parseInt(resource.Created)) }}</v-card-subtitle>
        </v-card-item>
        <v-card-text v-if="resource['Labels']['org.opencontainers.image.description']">
            {{ resource['Labels']['org.opencontainers.image.description'] }}
        </v-card-text>
        <v-card-text v-else class="text--secondary">
            {{ imageTitle().toLowerCase() }} does not provide <a
                href="https://github.com/opencontainers/image-spec/blob/main/annotations.md">oci labels for a
                description</a>.
        </v-card-text>
        <v-card-actions>
            <v-btn size="small" variant="plain" icon @click="reveal = !reveal">
                <v-icon :icon="reveal ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
            </v-btn>
            <v-btn size="small" target="_blank" variant="plain" icon
                :href="resource['Labels']['org.opencontainers.image.url']"
                v-if="resource['Labels']['org.opencontainers.image.url']">
                <v-icon icon="mdi-open-in-new" />
            </v-btn>
            <v-btn size="small" target="_blank" variant="plain" icon
                :href="resource['Labels']['org.opencontainers.image.documentation']"
                v-if="resource['Labels']['org.opencontainers.image.documentation']">
                <v-icon icon="mdi-file-document" />
            </v-btn>
            <v-btn size="small" target="_blank" variant="plain" icon
                :href="resource['Labels']['org.opencontainers.image.source']"
                v-if="resource['Labels']['org.opencontainers.image.source']">
                <v-icon icon="mdi-github" />
            </v-btn>
            <v-spacer />
            <span v-if="resource['Labels']['org.opencontainers.image.vendor']" class="text-overline font-weight-light ma-0">
                by {{ resource['Labels']['org.opencontainers.image.vendor'] }}
            </span>
        </v-card-actions>
        <v-expand-transition>
            <div v-show="reveal">
                <pre> {{ resource }}</pre>
            </div>
        </v-expand-transition>
    </v-card>
</template>
<script setup lang="ts">
import { ImageInspectInfo } from 'dockerode';
import { fromUnixTime } from 'date-fns'
import { ref } from 'vue';
import placeHolder from '@/assets/docker-placeholder-logo.png'
interface Props {
    resource: ImageInspectInfo
}
const reveal = ref(false)
const props = defineProps<Props>()
const imageTitle = () => {
    if (props.resource['Labels'] && props.resource['Labels']['org.opencontainers.image.title']) {
        return <string>props.resource['Labels']['org.opencontainers.image.title']
    } else if (props.resource['RepoTags'][0] && props.resource['RepoTags'][0] !== '<none>:<none>') {
        return <string>props.resource['RepoTags'][0]
    }
    return <string>props.resource.Id.slice(7, 19)
}
const imageSize = () => {
    return props.resource.Size / 1000 / 1000
}
const formatDates = (date: number) => {
    return fromUnixTime(date).toLocaleString()
}
const imageIcon = (labels) => {
    if (labels['sh.yacht.icon']) {
        return labels['sh.yacht.icon'];
    }
    if (
        labels['org.opencontainers.image.vendor']
    ) {
        const vendor = labels['org.opencontainers.image.vendor']?.toLowerCase();
        switch (vendor) {
            case 'linuxserver.io': {
                return 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png';
            }
            case 'portainer.io': {
                return labels['com.docker.desktop.extension.icon'] || null;
            }
            default: {
                return labels['sh.yacht.icon'] || null;
            }
        }
    } else {
        return placeHolder;
    }
}
</script>