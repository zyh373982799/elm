import Vue from 'vue'
import Router from 'vue-router'

import Homepage from '@/components/Homepage'
import Login from '@/components/Login'
import Myzone from '@/components/Myzone'
import Order from '@/components/Order'
import Search from '@/components/Search'
import Business from '@/components/Business'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Homepage
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Myzone',
      name: 'Myzone',
      component: Myzone
    },
    {
      path: '/Order',
      name: 'Order',
      component: Order
    },
    {
      path: '/Search/:keyword',
      name: 'Search',
      component: Search
    },
    {
      path: '/Business/:id',
      name: 'Business',
      component: Business
    }
  ]
})
