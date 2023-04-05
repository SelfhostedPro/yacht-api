<template>
            <v-card-text>
                <v-form>
                    <v-text-field label="username" append-inner-icon="mdi-account-circle"/>
                    <v-text-field label="password" type="password" append-inner-icon="mdi-shield-key"/>
                </v-form>
                <v-spacer/>
                <v-btn block color="primary" elevation="4">
                    Submit
                </v-btn>
            </v-card-text>
</template>

<script setup lang="ts">
</script>