import { computed } from 'vue'
import lightLogo from "@/assets/logo-light.svg";
import darkLogo from "@/assets/logo.svg";
import vuetify from '@/plugins/vuetify';

export function Logo() {
    if (vuetify.theme.current.value.dark == true) {
        return darkLogo;
    } else if (vuetify.theme.current.value.dark == false) {
        return lightLogo;
    }
}