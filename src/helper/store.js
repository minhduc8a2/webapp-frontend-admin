import { createStore } from "vuex"
import staffService from "@/services/staff.service"
import router from "@/router/index"
const store = createStore({
  state() {
    return {
      logined: false,
    }
  },
  mutations: {
    setLogined(state, value) {
      state.logined = value
    },
  },
  getters: {
    logined(state) {
      return state.logined
    },
  },
  actions: {
    async login({ commit }, authData) {
      if (authData) {
        var result = await staffService.login({
          username: authData.username,
          password: authData.password,
        })
      } else {
        var result = await staffService.login({})
      }
      if (result.status == true) {
        localStorage.setItem("library_token", result.data)
        commit("setLogined", true)
        router.push({ name: "home" })
      }
    },
    async logout({ commit }) {
      console.log("logout")
      commit("setLogined", false)
      localStorage.removeItem("library_token")
      console.log(localStorage.getItem("library_token"))

      router.push({ name: "login" })
    },
  },
})
export default store
