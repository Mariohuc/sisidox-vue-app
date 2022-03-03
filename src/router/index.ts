import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import AppointmentSearch from "../views/AppointmentSearch.vue";
import Admin from "../views/Admin.vue";
import RegisterDoctor from "@/views/RegisterDoctor.vue"
import RegisterAdmin from "@/views/RegisterAdmin.vue"
import AppointmentVideoCall from "@/views/AppointmentVideoCall.vue";
import AdminDashboard from "@/components/admin/AdminDashboard.vue"
import AccessCreation from "@/components/admin/AccessCreation.vue"
import { Role } from "@/store/models";
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
      roles: [ Role.DOCTOR ]
    }
  },
  {
    path: "/patient",
    name: "Patient",
    component: () => import("../views/Patient.vue"),
    meta: {
      roles: [ Role.PATIENT ]
    }
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: {
      roles: [ Role.ADMINISTRATOR ]
    },
    children: [
      {
        path: "",
        redirect: "dashboard"
      },
      {
        path: "dashboard",
        component: AdminDashboard
      },
      {
        path: "access-creation",
        component: AccessCreation
      }
    ]
  },
  {
    path: "/register-doctor/:dcTicketId",
    component: RegisterDoctor
  },
  {
    path: "/register-admin/:acTicketId",
    component: RegisterAdmin
  },
  {
    path: "/appointment-video-call/:bookedApptId",
    component: AppointmentVideoCall
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
  const found: any = to.matched.find(record => !!record.meta.roles );
  if (found) {
    const requiredRoles: Array<Role> = found.meta.roles;
    if (AuthStore.roles.some( item => requiredRoles.includes(item) )) {
      next();
    } else {
      //alert('You must be logged in to see this page');
      next({ path: '/' })
    }
  } else {
    next();
  }
});

export default router;
