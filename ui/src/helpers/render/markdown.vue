<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, computed, h } from 'vue'

import MarkdownIt, { Options as MarkdownItOptions } from 'markdown-it'
import sanitizeHtml from 'sanitize-html';

export default defineComponent({
  name: 'VueMarkdown',
  props: {
    source: {
      type: String || undefined,
      required: true,
    },
    options: {
      type: Object as PropType<MarkdownItOptions>,
      default: () => ({}),
      required: false,
    },
  },
  setup(props, { attrs }) {
    const md = new MarkdownIt(props.options)
    if (props.source !== undefined) {
      const content = computed(() => {
        const src = props.source
        return sanitizeHtml(md?.render(src))
      })

      return () =>
        h('div', {
          ...attrs,
          innerHTML: content.value,
        })
    }
  },
})
</script>