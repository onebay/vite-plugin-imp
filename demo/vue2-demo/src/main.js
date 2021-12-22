import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  render: (h) => h(App)
}).$mount();
