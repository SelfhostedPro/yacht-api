/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify, ThemeDefinition  } from 'vuetify'

// Beta Components
import * as labs from 'vuetify/labs/components'


const yachtDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#41b883",
    secondary: "#424242",
    background: "#000000",
    tabs: "#1E1E1E",
    foreground: "#323232"
  }
}

const yachtLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#008bcf",
    secondary: "#F3F5F9",
    background: "#FFFFFF",
    tabs: "#FFFFFF",
    foreground: "#FFFFFF"
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...labs,
  },
  theme: {
    defaultTheme: 'yachtDarkTheme',
    themes: {
      yachtDarkTheme,
      yachtLightTheme
    }
  },
})
