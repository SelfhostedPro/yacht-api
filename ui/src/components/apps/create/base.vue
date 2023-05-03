<template>
    <v-card color="foreground">
        <v-card-title class="text-center"> info </v-card-title>
        <v-card-text>
            <v-text-field label="name" placeholder="My Container" required></v-text-field>
            <v-text-field label="image" placeholder="image:my-image" required></v-text-field>
            <v-select :items="['always', 'on-failure', 'unless-stopped', 'none']" label="restart policy"
                required></v-select>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">

</script>