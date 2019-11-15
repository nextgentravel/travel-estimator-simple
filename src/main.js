import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import './assets/aurora.min.css'
import './assets/override.css'
import './assets/auto-complete-style.css'
import VueRouter from 'vue-router'
import Calculator from './components/Calculator.vue'
import TripSelector from './components/TripSelector.vue'

Vue.use(VueRouter)

Vue.use(Autocomplete)
Vue.use(Datetime)
Vue.use(require("moment"));

Vue.config.productionTip = false


const router = new VueRouter({
  routes: [
    { path: '/', component: TripSelector },
    { path: '/calculate', component: Calculator },
  ]
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
