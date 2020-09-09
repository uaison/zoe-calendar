import Vue from 'vue'
import App from './App.vue'
import ZoeCalendar from './zoe-calendar'

Vue.use(ZoeCalendar)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
