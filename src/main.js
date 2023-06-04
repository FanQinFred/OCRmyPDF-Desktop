import Vue from 'vue'
import App from './App.vue'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import http from "./utils/request"
import router from "./router/index"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Meta from 'vue-meta';
import common from './utils/common.js'

Vue.use(Meta);
Vue.use(ViewUI);
Vue.use(ElementUI);

Vue.prototype.$global = common;
Vue.prototype.$http = http;
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

