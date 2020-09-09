import pickerComponent from './index.vue'
import {mergeOptions} from './merge-options'

let $vm;

export default {
  install(Vue) {
    if (!$vm) {
      const pickerPlugin = Vue.extend(pickerComponent);
      $vm = new pickerPlugin({
        el: document.createElement('div'),
      });
      document.body.appendChild($vm.$el);
    }
    $vm.visible = false;
    let calendar = {
      show(options) {
        if (typeof options === 'object') {
          mergeOptions($vm, options)
        }
        $vm.hasCalendar = true;
        $vm.visible = true;
      },
      hide() {
        $vm.visible = false;
      }
    };

    Vue.prototype.$calendar = calendar;
  }
}
