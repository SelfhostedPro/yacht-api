<template>
    <v-card flat>
        <v-card-text>
            <v-form>
                <v-row :dense="mdAndDown" align="center">
                    <v-col cols="12">
                        <v-text-field label="name" required placeholder="yacht" v-model="base.name" hide-details="auto"
                            :error-messages="v$.name.$errors.map(e => e.$message.toString())" @input="v$.name.$touch"
                            @blur="v$.name.$touch" />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="image" placeholder="ghcr.io/selfhostedpro/yacht-api:main" v-model="base.image"
                            hide-details="auto" :error-messages="v$.image.$errors.map(e => e.$message.toString())"
                            @input="v$.image.$touch" @blur="v$.image.$touch" />
                    </v-col>
                    <v-col cols="12">
                        <v-select :items="['always', 'on-failure', 'unless-stopped', 'none']" v-model="base.restart"
                            label="restart policy" hide-details="auto" />
                    </v-col>
                    <v-col cols="12">
                        <v-select :items="servers" v-model="base.server" label="server" hide-details="auto" />
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>
  
<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'


const rules = {
    name: {
        required: helpers.withMessage('name is required', helpers.withParams({ parent: 'base' }, required)),
    },
    image: {
        required: helpers.withMessage('image is required', helpers.withParams({ parent: 'base' }, required))
    },
    restart: {
        required: helpers.withMessage('restart policy is required', helpers.withParams({ parent: 'base' }, required))
    },
    server: {
        required: helpers.withMessage('server is required', helpers.withParams({ parent: 'base' }, required))
    }
}

const props = defineProps(['modelValue', 'servers'])
const emit = defineEmits(['update:modelValue'])
const base = computed({
    get() {
        return props.modelValue
    },
    set(base) {
        emit('update:modelValue', base)
    }
})
const v$ = useVuelidate(rules, base)

const { mdAndDown } = useDisplay()
</script>
  