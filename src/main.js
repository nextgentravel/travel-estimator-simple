import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import './assets/aurora.min.css'
import './assets/override.css'
import './assets/auto-complete-style.css'

Vue.use(Autocomplete)
Vue.use(Datetime)
Vue.use(require("moment"));

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
