import { createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/index",
    component: ()=> import("../pages/index.vue")
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router