import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/home/Home';
import Portfolio from '@/components/portfolio/Portfolio';
import About from '@/components/about/About';
import Contact from '@/components/contact/Contact';
import Investors from '@/components/investors/Investors';

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
    {
      path: '/investors',
      name: 'Investors',
      component: Investors,
    },
  ],
});
