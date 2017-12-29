// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import jQuery from './../node_modules/jquery/dist/jquery';
import BootstrapVue from './../node_modules/bootstrap-vue/dist/bootstrap-vue.esm';
import Portfolio from './components/portfolio/Portfolio';
import Home from './components/home/Home';
import About from './components/about/About';
import Contact from './components/contact/Contact';

import App from './App';
import router from './router';
import './../node_modules/bootstrap/dist/css/bootstrap.css';
import './../node_modules/bootstrap-vue/dist/bootstrap-vue.css';

window.jQuery = jQuery;
window.$ = jQuery;
Vue.use(BootstrapVue);


Vue.config.productionTip = false;
Vue.config.debug = true;
Vue.component('portfolio', Portfolio);
Vue.component('home', Home);
Vue.component('about', About);
Vue.component('contact', Contact);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    mainView: 'home',
    leftView: 'portfolio',
    rightView: 'about',
    bottomView: 'contact',
  },
  render: h => h(App),
});

// function index() {
//   app.leftView = 'portfolio';
// }
//
// page('/', index());

