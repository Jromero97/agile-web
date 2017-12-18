import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/home/Home.vue';
import Portfolio from '@/components/portfolio/Portfolio.vue';
import About from '@/components/about/About.vue';
import Contact from '@/components/contact/Contact.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/portfolio',
      name: 'Portfolio',
      component: Portfolio,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
    },
  ],
});
