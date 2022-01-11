<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
  <AntDesignVue />
  <ArcoDesignVue />
  <img v-for="img in imageList" v-lazy="img" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import AntDesignVue from './components/AntDesignVue.vue'
import ArcoDesignVue from './components/ArcoDesignVue.vue'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
    AntDesignVue,
    ArcoDesignVue
  },
  setup() {
    return {
      imageList: [
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg',
      ],
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>