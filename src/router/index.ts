import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import AppointmentSearch from "../views/AppointmentSearch.vue";

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
    component:  () => import("../views/Doctor.vue")
  },
  {
    path: "/patient",
    name: "Patient",
    component: () => import("../views/Patient.vue")
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

export default router;
