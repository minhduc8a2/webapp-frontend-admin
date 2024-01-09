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
      let result = await staffService.login({
        username: authData.username,
        password: authData.password,
      })
      if (result.status == true) {
        commit("setLogined", true)
        router.push({ name: "home" })
      }
    },
  },
})
export default store
