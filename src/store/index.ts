import { createStore } from 'vuex'
import menu from './modules/menu'
export default createStore({
  state: {
    token: ''
  },
  getters: {
  },
  mutations: {
    SET_TOKEN: (state, token) => {
			state.token = token
			localStorage.setItem("token", token)
		},
  },
  actions: {
  },
  modules: {
    menu
  }
})
