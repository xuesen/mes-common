<template>
  <ii-container :style="{height: height || '100%'}" direction="vertical" class="ii-panel">
    <ii-header :height="headerHeight || '40px'" v-if="title || $slots.title">
      <slot name="title" class="title">
        <h2>{{title}}</h2>
      </slot>
    </ii-header>
    <ii-main>
      <slot />
    </ii-main>
  </ii-container>
</template>
<script>
export default {
  name: 'IiPanel',
  props: {
    title: String,
    height: String,
    headerHeight: String
  },
  data () {
    return {
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  methods: {
  },
  async mounted () {
  },
  watch: {
  }
}
</script>
