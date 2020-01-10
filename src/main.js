import 'babel-polyfill';
import 'whatwg-fetch'
import 'unorm';
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
import Print from './components/Print.vue'
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css'

const datepickerOptions = {
  sundayFirst: true,
  dateLabelFormat: 'dddd, MMMM D, YYYY',
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  colors: {
    selected: '#00a699',
    inRange: '#66e2da',
    selectedText: '#fff',
    text: '#565a5c',
    inRangeBorder: '#33dacd',
    disabled: '#fff',
    hoveredInRange: '#67f6ee'
  },
  texts: {
    apply: 'Apply',
    cancel: 'Cancel',
    keyboardShortcuts: 'Keyboard Shortcuts',
  },
  keyboardShortcuts: [
    {symbol: '↵', label: 'Select the date in focus', symbolDescription: 'Enter key'},
    {symbol: '←/→', label: 'Move backward (left) and forward (right) by one day.', symbolDescription: 'Left or right arrow keys'},
    {symbol: '↑/↓', label: 'Move backward (up) and forward (down) by one week.', symbolDescription: 'Up or down arrow keys'},
    {symbol: 'PgUp/PgDn', label: 'Switch months.', symbolDescription: 'PageUp and PageDown keys'},
    {symbol: 'Home/End', label: 'Go to the first or last day of a week.', symbolDescription: 'Home or End keys'},
    {symbol: 'Esc', label: 'Close this panel', symbolDescription: 'Escape key'},
    {symbol: '?', label: 'Open this panel', symbolDescription: 'Question mark'}
  ],
}

Vue.use(AirbnbStyleDatepicker, datepickerOptions)

Vue.use(VueRouter)

Vue.use(Autocomplete)
Vue.use(Datetime)
Vue.use(require("moment"));

Vue.config.productionTip = false


const router = new VueRouter({
  routes: [
    { path: '/', component: TripSelector },
    { path: '/calculate', component: Calculator },
    { path: '/print', component: Print },
  ]
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
