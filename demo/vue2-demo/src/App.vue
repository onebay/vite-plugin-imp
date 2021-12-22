<template>
  <v-app>
    <h2>vue2</h2>
    <el-button>ElButton</el-button>
    <v-avatar
      color="orange"
      size="56"
    >
      VJ
    </v-avatar>
  </v-app>
</template>
<script>
import { Button } from 'element-ui'
import { 
  VAvatar,
  VApp
} from 'vuetify'
console.log(`VApp`, VApp)
export default {
  components: {
    ElButton: Button,
    'v-avatar': VAvatar,
    'v-app': VApp
  },
  beforeCreate() {
    console.log(`this.$vuetify`, this.$vuetify)
    console.log(this.$vuetify.$root === this.$vuetify.$el)
  }
}
</script>