<template>
  <h2>ant-design-vue component</h2>
  <Button>ant-design-vue Button</Button>
  <Popconfirm
    title="Are you sure delete this task?"
    ok-text="Yes"
    cancel-text="No"
    @confirm="confirm"
    @cancel="cancel"
  >
    <a href="#">Delete</a>
  </Popconfirm>
</template>
<script>
import { Button, Popconfirm, message } from 'ant-design-vue'

export default {
  name: 'AntDesignVueDemo',
  components: {
    Button,
    Popconfirm
  },
  methods: {
    confirm(e) {
      console.log(e);
      message.success('Click on Yes');
    },
    cancel(e) {
      console.log(e);
      message.error('Click on No');
    },
  },
}
</script>