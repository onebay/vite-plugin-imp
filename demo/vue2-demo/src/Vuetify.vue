<template>
  <v-app>
    <v-avatar
      color="orange"
      size="56"
    >
      VJ
    </v-avatar>
    <slot />
  </v-app>
</template>
<script>
import { 
  VAvatar,
  VApp
} from 'vuetify'
console.log(`VApp`, VApp)
export default {
  components: {
    VAvatar,
    VApp
  }
}
</script>