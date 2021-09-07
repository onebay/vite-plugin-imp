import { createApp } from 'vue'
import App from './App.vue'
import { forEach } from 'lodash'

forEach([1,2], console.log)

createApp(App).mount('#app')
