<template>
  <div>
    <h2>vue2</h2>
    <el-button>ElButton</el-button>
    <ViewUI />
    <Vuetify />
  </div>
</template>
<script>
import { Button } from 'element-ui'
import ViewUI from './ViewUI.vue'
import Vuetify from './Vuetify.vue'

export default {
  components: {
    ElButton: Button,
    Vuetify,
    ViewUI
  },
  beforeCreate() {
    console.log(`this.$vuetify`, this.$vuetify)
    console.log(this.$vuetify.$root === this.$vuetify.$el)
  }
}
</script>