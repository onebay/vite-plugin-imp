<template>
  <div :style="{ display: 'flex' }">
    <a-card :style="{ width: '360px' }" title="Arco Card">
      <template #extra>
        <a-link>More</a-link>
      </template>
      ByteDance's core product, Toutiao ("Headlines"), is a content platform in
      China and around the world. Toutiao started out as a news recommendation
      engine and gradually evolved into a platform delivering content in various
      formats.
    </a-card>
    <a-countdown title="Countdown" :value="Date.now() + 2 * 3600 * 1000" :now="Date.now()" :start="start" />
  </div>
</template>
<script>
import { Card, Link, Countdown, addI18nMessages } from '@arco-design/web-vue'
export default {
  components: {
    'a-card': Card,
    'a-link': Link,
    'a-countdown': Countdown
  }
}
</script>
