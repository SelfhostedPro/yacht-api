/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { mdi } from 'vuetify/iconsets/mdi'
import { aliases, fa } from 'vuetify/iconsets/fa'


// Composables
import { createVuetify, ThemeDefinition  } from 'vuetify'

// Beta Components
import * as labs from 'vuetify/labs/components'


const yachtDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#47978F",
    secondary: "#424242",
    background: "#000000",
    tabs: "#1E1E1E",
    foreground: "#323232"
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
      fa,
    }
  },
  components: {
    ...labs,
  },
  theme: {
    defaultTheme: 'yachtDarkTheme',
    themes: {
      yachtDarkTheme,
    }
  },
})
