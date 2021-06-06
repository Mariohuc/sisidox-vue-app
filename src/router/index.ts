import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import AppointmentSearch from "../views/AppointmentSearch.vue";
import { Menu, Role } from "@/store/models";
import AuthStore from "@/store/modules/auth";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: '/appointment-search',
    name: "AppointmentSearch",
    component: AppointmentSearch
  },
  {
    path: "/doctor",
    name: "Doctor",
    component:  () => import("../views/Doctor.vue"),
    meta: {
      authUser: Role.DOCTOR
    }
  },
  {
    path: "/patient",
    name: "Patient",
    component: () => import("../views/Patient.vue"),
    meta: {
      authUser: Role.PATIENT
    }
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const found = to.matched.find(record => !!record.meta.authUser );

  if (found) {
    if (AuthStore.roles.some( item => item === found.meta.authUser )) {
      next();
    } else {
      //alert('You must be logged in to see this page');
      next({
        path: '/',
      });
    }
  } else {
    next();
  }
});

export default router;
