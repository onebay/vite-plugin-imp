import { createApp } from 'vue'
import App from './App.vue'
import { forEach } from 'lodash'

import { Lazyload } from 'vant'

forEach([1,2], console.log)

createApp(App).use(Lazyload, {lazyComponent: true}).mount('#app')
