// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import jQuery from 'jquery';

import Portfolio from '@/components/portfolio/Portfolio.vue';
import Home from '@/components/home/Home.vue';
import About from '@/components/about/About.vue';
import Contact from '@/components/contact/Contact.vue';

import App from './App';
import router from './router';

window.jQuery = jQuery;
window.$ = jQuery;

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
});

// function index() {
//   app.leftView = 'portfolio';
// }
//
// page('/', index());
