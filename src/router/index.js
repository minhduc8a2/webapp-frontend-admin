import { createWebHistory, createRouter } from "vue-router"
import Book from "@/views/Book.vue"
import Reader from "@/views/Reader.vue"
import Staff from "@/views/Staff.vue"
import Publisher from "@/views/Publisher.vue"
import BorrowTracker from "@/views/BorrowTracker.vue"
const routes = [
  {
    path: "/",
    name: "books",
    component: Book,
  },
  // {
  //   path: "/books/:id",
  //   name: "book.edit",
  //   component: Book,
  // },
  {
    path: "/readers",
    name: "readers",
    component: Reader,
  },

  {
    path: "/staffs",
    name: "staffs",
    component: Staff,
  },

  {
    path: "/publishers",
    name: "publishers",
    component: Publisher,
  },

  {
    path: "/borrowTrackers",
    name: "borrowTrackers",
    component: BorrowTracker,
  },

  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
export default router
