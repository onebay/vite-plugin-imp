<template>
  <h1>{{ msg }}</h1>

  <div>
    <button @click="count++">count is: {{ count }}</button>
  </div>
  <Button>Vant Button</Button>
  <Progress :percentage="3" />
  <ElButton>element-plus button</ElButton>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { Button, Progress } from 'vant'
import { ElButton } from 'element-plus'
export default defineComponent({
  name: 'HelloWorld',
  components: {
    Button,
    Progress,
    ElButton
  },
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  setup: () => {
    const count = ref(0)
    return { count }
  }
})
</script>

<style scoped>
a {
  color: #42b983;
}
</style>